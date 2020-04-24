import { Module } from "@nestjs/common";
import { DynamoDBServices } from "_ApplicationLayer/Services/aws.services";
import { DDBDatabaseModule as DB } from "_InfrastructureLayer/Databases/DynamoDB/database.module";


const dynamodbService = new DynamoDBServices();

@Module({
  imports: [DB.withConfig(dynamodbService)],
  exports: [DatabaseModule]
})
export class DatabaseModule{}