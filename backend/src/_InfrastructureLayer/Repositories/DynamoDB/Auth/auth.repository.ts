(global as any).fetch = require('node-fetch');
import { Injectable } from "@nestjs/common";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as Axios from "axios";
import * as jsonwebtoken from "jsonwebtoken";
import { promisify } from "util";
import { AuthLoginDto } from "_ApplicationLayer/DTO/Auth";
import { Claim } from "_ApplicationLayer/Models/Auth/claim.model";
import { MapOfKidToPublicKey } from "_ApplicationLayer/Models/Auth/mapOfKidToPublicKey.model";
import { PublicKeys } from "_ApplicationLayer/Models/Auth/publicKey.model";
import { TokenHeader } from "_ApplicationLayer/Models/Auth/tokenHeader.model";
import { AuthSession } from "_DomainLayer/Entities/Auth/authSession";
import { IAuthRepository } from "_DomainLayer/Repositories/DynamoDB/IAuthRepository";
import { logThrowDynamoDBError } from "../utils/utils";
import { AuthAttrsTransformer } from "./transformers/attributes.transformer";
import DynamoDB = require("aws-sdk/clients/dynamodb");
import { DDBUser } from "_DomainLayer/Entities/DynamoDB/user.ddb";
import { AuthSignupDto } from "_ApplicationLayer/DTO/Auth/auth-signup.dto";
import moment = require("moment");
import * as AWS from "aws-sdk";
import env_variables from '_Common/env_variables';


@Injectable()
export class AuthRepository implements IAuthRepository {
  private cognitoPoolId = process.env.COGNITO_POOL_ID || "";
  private clientId = process.env.COGNITO_CLIENT_ID || "";
  private userPoolRegion = process.env.COGNITO_REGION || "";
  private cognitoIssuer = `https://cognito-idp.${this.userPoolRegion}.amazonaws.com/${this.cognitoPoolId}`;
  private jwkToPem = require("jwk-to-pem");
  private verifyPromised = promisify(jsonwebtoken.verify.bind(jsonwebtoken));

  private dynamoDBApiVersion = process.env.DYNAMODB_API_VERSION || "";
  private dynamoDBRegion = process.env.DYNAMODB_REGION || "";
  private dynamoDBTableName = process.env.DYNAMODB_TABLE || "";

  private accessKeyId = process.env.ACCESS_KEY_ID || "";
  private secretAccessKey = process.env.SECRET_ACCESS_KEY || "";

  private client: DocumentClient = new DocumentClient({
    apiVersion: this.dynamoDBApiVersion,
    region: this.dynamoDBRegion,
  });

  private db: DynamoDB = new DynamoDB({
    apiVersion: this.dynamoDBApiVersion,
    region: this.dynamoDBRegion,
  });
  private tableName: string = this.dynamoDBTableName;

  public readonly transformer = new AuthAttrsTransformer();

  constructor() {
    console.log("env_variables.isDev",env_variables.isDev);
    if (env_variables.isDev) {
      AWS.config.update({
        region: this.userPoolRegion,
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey
      });
    }
  }

  public async createNewUser(newUser: AuthSignupDto): Promise<AuthSession> {
    
    const { email,password} = newUser;

    const cognito = new AWS.CognitoIdentityServiceProvider()
    await cognito.adminCreateUser({
      UserPoolId: this.cognitoPoolId,
      Username: email,
      MessageAction: 'SUPPRESS',
      TemporaryPassword: password,
    }).promise()

    const initAuthResponse = await cognito.adminInitiateAuth({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      ClientId: this.clientId,
      UserPoolId: this.cognitoPoolId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    }).promise()

    if (initAuthResponse.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      
     await cognito.adminRespondToAuthChallenge({
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ClientId: this.clientId,
        UserPoolId: this.cognitoPoolId,
        ChallengeResponses: {
          USERNAME: email,
          NEW_PASSWORD: password,
        },
        Session: initAuthResponse.Session
      }).promise();

    }

    await this.addUserToDatabase(newUser,initAuthResponse.ChallengeParameters.USER_ID_FOR_SRP)

    let authSession = await this.getAuthenticateUser({
        email,
        password
    });

    return authSession;
  }

  public async getAuthenticateUser(
    authLogin: AuthLoginDto
  ): Promise<AuthSession> {
    const userPoolData = {
      UserPoolId: this.cognitoPoolId,
      ClientId: this.clientId,
    };

    const userPool = new CognitoUserPool(userPoolData);

    var authenticationDetails = new AuthenticationDetails({
      Username: authLogin.email,
      Password: authLogin.password,
    });

    var cognitoUser = new CognitoUser({
      Username: authLogin.email,
      Pool: userPool,
    });

    var userSession = await this.authenticateUserAsync(
      cognitoUser,
      authenticationDetails
    );

    let awsId = userSession.getAccessToken().payload["sub"];

    let user = await this.getUserByAwsId(awsId);

    if (!user.IsActive) {
      console.log(`User is not authorized - ${awsId}`, user);
      throw new Error("User is not authorized");
    }

    const authSession: AuthSession = {
      User: user,
      AccessToken: userSession.getIdToken().getJwtToken(),
      RefreshToken: userSession.getRefreshToken().getToken(),
    };

    return authSession;
  }

  private async getAuthClaim(token: string): Promise<Claim> {
    const tokenSections = (token || "").split(".");
    if (tokenSections.length < 2) {
      throw new Error("requested token is invalid");
    }

    const headerJSON = Buffer.from(tokenSections[0], "base64").toString("utf8");
    const header = JSON.parse(headerJSON) as TokenHeader;
    const keys = await this.getPublicKeys();
    const key = keys[header.kid];

    if (key === undefined) {
      throw new Error("claim made for unknown kid");
    }

    const claim = (await this.verifyPromised(token, key.pem)) as Claim;
    const currentSeconds = Math.floor(new Date().valueOf() / 1000);

    if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
      throw new Error("claim is expired or invalid");
    }
    if (claim.iss !== this.cognitoIssuer) {
      throw new Error("claim issuer is invalid");
    }
    if (claim.token_use !== "id") {
      throw new Error("claim use is not access");
    }

    return claim;
  }

  public async getAuthenticateUserWithAccessToken(
    token: string
  ): Promise<AuthSession> {
    try {
      let claim = await this.getAuthClaim(token);
      let user = await this.getUserByAwsId(claim.sub);

      if (!user.IsActive) {
        console.log(`User is not authorized - ${claim.sub}`, user);
        throw new Error("User is not authorized");
      }

      const authSession: AuthSession = {
        User: user,
        AccessToken: token,
      };

      return authSession;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async authorizeToken(token: string): Promise<Claim> {
    try {
      let claim = await this.getAuthClaim(token);
      console.log(`claim confirmed for ${claim.aud}`);
      return claim;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private async authenticateUserAsync(
    cognitoUser: CognitoUser,
    authenticationDetails: AuthenticationDetails
  ): Promise<CognitoUserSession> {
    return new Promise(function (resolve, reject) {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => resolve(result),
        onFailure: (err) => reject(err),
      });
    });
  }

  private async getPublicKeys(): Promise<MapOfKidToPublicKey> {
    let cacheKeys: MapOfKidToPublicKey | undefined;

    if (!cacheKeys) {
      const url = `${this.cognitoIssuer}/.well-known/jwks.json`;
      const publicKeys = await Axios.default.get<PublicKeys>(url);
      cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
        const pem = this.jwkToPem(current);
        agg[current.kid] = { instance: current, pem };
        return agg;
      }, {} as MapOfKidToPublicKey);
      return cacheKeys;
    } else {
      return cacheKeys;
    }
  }

  private async getUserByAwsId(awsId: string) {
    let dataItems: DocumentClient.QueryOutput;

    
    const params: DocumentClient.QueryInput = {
      TableName: this.tableName,
      IndexName: "ByTypeTarget",
      KeyConditionExpression: "#gsi_sk = :value ",
      ExpressionAttributeNames: {
        "#gsi_sk": this.transformer.attrName("GSIK"),
      },
      ExpressionAttributeValues: {
        ":value": this.transformer.itemToAttrsTransformer.TypeTarget(awsId),
      },
    };

    dataItems = await this.client
      .query(params)
      .promise()
      .catch(logThrowDynamoDBError("AuthRepository getUserByAwsId", params));

    let user = this.transformer.buildFullObject(dataItems.Items);
    return user;
  }

  private async addUserToDatabase(newUser: AuthSignupDto, userId: string) {
    let ddbUser: DDBUser = {
      UserId: userId,
      FirstName: newUser.firstName,
      LastName: newUser.lastName,
      FullName: `${newUser.lastName}, ${newUser.firstName}`,
      Email: newUser.email,
      AwsId: userId,
      IsConfirmed: true,
      Roles: ["user"],
      CreatedBy: userId,
      CreatedAt: moment.utc().format(),
      UpdatedAt: moment.utc().format(),
      UpdatedBy: userId,
      IsActive:true
    };

    let inputData = this.transformer.transformItemToAttrs(ddbUser);

    const params = {
      TableName: this.tableName,
      Item: inputData,
    };

    await this.client
      .put(params)
      .promise()
      .then((data) => data)
      .catch(logThrowDynamoDBError("AuthRepository Put", params));

    return ddbUser;
  }
}
