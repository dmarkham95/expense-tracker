import { Injectable } from "@nestjs/common";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { DDBTransaction, DDBTransaction_AllAttrs } from "_DomainLayer/Entities/DynamoDB/Transaction.ddb";
import { ITransactionRepository } from "_DomainLayer/Repositories/DynamoDB/ITransactionRepository.ddb";
import { logDynamoDBError, logThrowDynamoDBError } from "../utils/utils";
import { TransactionAttrsTransformer } from "./transformers/attributes.transformer";
import DynamoDB = require("aws-sdk/clients/dynamodb");
import { DDB_Type } from "_DomainLayer/Enums/ddb-types";


@Injectable()
export class DDBTransactionRepository implements ITransactionRepository {
  
    private dynamoDBApiVersion = process.env.DYNAMODB_API_VERSION || '';
    private dynamoDBRegion = process.env.DYNAMODB_REGION || '';
    private dynamoDBTableName = process.env.DYNAMODB_TABLE || '';
  
    client: DocumentClient = new DocumentClient({ apiVersion: this.dynamoDBApiVersion, region: this.dynamoDBRegion });
    db: DynamoDB = new DynamoDB({ apiVersion: this.dynamoDBApiVersion, region: this.dynamoDBRegion });
    tableName: string = this.dynamoDBTableName;
    
    public readonly transformer = new TransactionAttrsTransformer();

  public async getAllTransaction(userId: string): Promise<DDBTransaction[]> {
    let dataItems: DocumentClient.QueryOutput;

      const params: DocumentClient.QueryInput = {
        TableName: this.tableName,
        ScanIndexForward: false,
        ConsistentRead: false,
        KeyConditionExpression: '#userId = :userId AND begins_with(#typeTarget, :typeTarget) ',
        ExpressionAttributeNames: {
        '#userId': this.transformer.attrName("Node"),
        '#typeTarget': this.transformer.attrName("TypeTarget"),
      },
      ExpressionAttributeValues: {
        ':userId': userId,
        ':typeTarget': DDB_Type.Transaction,
      },
      };

      dataItems = await this.client.query(params).promise().catch(logThrowDynamoDBError('DDBTransactionRepository getAllTransaction', params));  

      let transactions = dataItems.Items.map((data: DocumentClient.AttributeMap) => this.transformer.transformAttrsToItem(data as DDBTransaction_AllAttrs));

      return transactions;
  }

    public async createTransaction(transaction: DDBTransaction): Promise<void> {
      await this.put(transaction);
    }

    public async updateTransaction(Transaction: DDBTransaction): Promise<void> {
      const params: DocumentClient.UpdateItemInput = {
        TableName: this.tableName,
        Key: this.transformer.primaryKey(Transaction.TransactionId,Transaction.UserId),
        UpdateExpression: 'SET #data = :data, #description = :description,#amount = :amount, #updatedAt = :updatedAt, #updatedBy = :updatedBy',
        ExpressionAttributeNames: {
          '#data': this.transformer.attrName('Data'),
          '#amount': this.transformer.attrName('Amount'),
          '#description': this.transformer.attrName('Description'),
          '#updatedAt': this.transformer.attrName('UpdatedAt'),
          '#updatedBy': this.transformer.attrName('UpdatedBy'),
        },
        ExpressionAttributeValues: {
          ':data': Transaction.Description,
          ':amount': Transaction.Amount,
          ':description': Transaction.Description,
          ':updatedAt': Transaction.UpdatedAt,
          ':updatedBy': this.transformer.itemToAttrsTransformer.User(Transaction.UpdatedBy),
        },
        ReturnValues: 'NONE',
      };
      await this.client
        .update(params)
        .promise()
        .catch(logThrowDynamoDBError('DDBTransactionRepository Update', params));
    }

    public async deleteTransaction(transactionId: string, userId: string): Promise<void> {
      await this.delete(transactionId,userId);
    }


    private async delete(id: string,unitId: string) {
      const params: DocumentClient.DeleteItemInput = {
        TableName: this.tableName,
        Key: this.transformer.primaryKey(id,unitId),
      };
      return this.client
        .delete(params)
        .promise()
        .then(data => data)
        .catch(logThrowDynamoDBError('DDBTransactionRepository delete', params));
    }

    private async exists(id: string,userId: string): Promise<boolean> {
      const params: DocumentClient.GetItemInput = {
        TableName: this.tableName,
        Key: this.transformer.primaryKey(id,userId),
        ProjectionExpression: this.transformer.attrName('TransactionId'),
      };
      return this.client
        .get(params)
        .promise()
        .then(data => {
          if (data.Item) {
            return true;
          }
          return false;
        })
        .catch(err => {
          logDynamoDBError('DDBTransactionRepository exists', err, params);
          return false;
        });
    }


    public async get(transactionId: string,unitId: string): Promise<DDBTransaction> {
      const params: DocumentClient.GetItemInput = {
        TableName: this.tableName,
        Key: this.transformer.primaryKey(transactionId,unitId),
      };
      return this.client
        .get(params)
        .promise()
        .then(data => {
          if (data.Item) {
            return this.transformer.transformAttrsToItem(data.Item as DDBTransaction_AllAttrs);
          }
          return null;
        })
        .catch<null>(err => {
          logDynamoDBError('DDBTransactionRepository get', err, params);
          return null;
        });
    }
  
    private async put(transaction: DDBTransaction) {
      let inputData = this.transformer.transformItemToAttrs(transaction);
      
      const params = {
        TableName: this.tableName,
        Item: inputData,
      };
      return this.client
        .put(params)
        .promise()
        .then(data => data)
        .catch(logThrowDynamoDBError('DDBTransactionRepository Put', params));
    }
     



}