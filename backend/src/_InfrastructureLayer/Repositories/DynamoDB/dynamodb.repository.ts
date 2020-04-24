import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';


export abstract class DDBRepository {
  client: DocumentClient;
  db: DynamoDB;
  tableName: string;

}
