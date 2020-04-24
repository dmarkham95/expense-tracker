import { Injectable } from "@nestjs/common";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import {
  DDBUser,
  DDBUser_AllAttrs,
} from "_DomainLayer/Entities/DynamoDB/user.ddb";
import { DDB_Type } from "_DomainLayer/Enums/ddb-types";
import { logDynamoDBError, logThrowDynamoDBError } from "../utils/utils";
import { UserAttrsTransformer } from "./transformers/attributes.transformer";
import DynamoDB = require("aws-sdk/clients/dynamodb");
import { IUserDDBRepository } from "_DomainLayer/Repositories/DynamoDB/IUserRepository";

@Injectable()
export class DDBUserRepository implements IUserDDBRepository {
  private dynamoDBApiVersion = process.env.DYNAMODB_API_VERSION || "";
  private dynamoDBRegion = process.env.DYNAMODB_REGION || "";
  private dynamoDBTableName = process.env.DYNAMODB_TABLE || "";

  client: DocumentClient = new DocumentClient({
    apiVersion: this.dynamoDBApiVersion,
    region: this.dynamoDBRegion,
  });
  db: DynamoDB = new DynamoDB({
    apiVersion: this.dynamoDBApiVersion,
    region: this.dynamoDBRegion,
  });
  tableName: string = this.dynamoDBTableName;

  public readonly transformer = new UserAttrsTransformer();

  constructor() {}

  public async getUserByAwsId(awsId: string): Promise<DDBUser> {
    return null;
  }

  public async getUserById(id: string): Promise<DDBUser> {
    let user = await this.get(id);
    return user;
  }

  public async getAll(accountId: string): Promise<DDBUser[]> {
    let dataItems: DocumentClient.QueryOutput;

    const params: DocumentClient.QueryInput = {
      TableName: this.tableName,
      ScanIndexForward: false,
      ConsistentRead: false,
      KeyConditionExpression:
        "#accountId = :accountId AND begins_with(#typeTarget, :typeTarget) ",
      //ProjectionExpression: this.transformer.attrName("TypeTarget"),
      ExpressionAttributeNames: {
        "#accountId": this.transformer.attrName("Node"),
        "#typeTarget": this.transformer.attrName("TypeTarget"),
      },
      ExpressionAttributeValues: {
        ":accountId": accountId,
        ":typeTarget": `${DDB_Type.user}`,
      },
    };

    dataItems = await this.client
      .query(params)
      .promise()
      .catch(logThrowDynamoDBError("DDBUserRepository getAll", params));

    let users = dataItems.Items.map((item: DocumentClient.AttributeMap) => {
      return this.transformer.transformAttrsToItem(item as DDBUser_AllAttrs);
    });
    return users;
  }

  private async get(unitId: string): Promise<DDBUser> {
    const params: DocumentClient.GetItemInput = {
      TableName: this.tableName,
      Key: this.transformer.primaryKey(unitId),
    };
    return this.client
      .get(params)
      .promise()
      .then((data) => {
        if (data.Item) {
          return this.transformer.transformAttrsToItem(
            data.Item as DDBUser_AllAttrs
          );
        }
        return null;
      })
      .catch<null>((err) => {
        logDynamoDBError("DDBUserRepository get", err, params);
        return null;
      });
  }

  private async put(unit: DDBUser) {
    let inputData = this.transformer.transformItemToAttrs(unit);

    const params = {
      TableName: this.tableName,
      Item: inputData,
    };
    return this.client
      .put(params)
      .promise()
      .then((data) => data)
      .catch(logThrowDynamoDBError("DDBUserRepository Put", params));
  }

  public async delete(id: string) {
    const params: DocumentClient.DeleteItemInput = {
      TableName: this.tableName,
      Key: this.transformer.primaryKey(id),
    };
    return this.client
      .delete(params)
      .promise()
      .then((data) => data)
      .catch(logThrowDynamoDBError("DDBUserRepository delete", params));
  }

  private async batchGet(userIds: string[]) {
    const params: DocumentClient.BatchGetItemInput = {
      RequestItems: {
        [this.tableName]: {
          Keys: userIds.map((id) => {
            return this.transformer.primaryKey(id);
          }),
        },
      },
    };
    return this.client
      .batchGet(params)
      .promise()
      .then((data) => {
        return data.Responses[this.tableName].map((item: DDBUser_AllAttrs) => {
          return this.transformer.transformAttrsToItem(item);
        });
      })
      .catch(logThrowDynamoDBError("DDBUserRepository batchGet", params));
  }
}
