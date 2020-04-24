import { DynamicModule, Module } from "@nestjs/common";
import { IDynamoDBService } from "_DomainLayer/Services/IAwsService";



@Module({
    imports: [],
    providers: [],
    exports: [],
  })
  export class DDBDatabaseModule {
    public static withConfig(
      dynamodbService: IDynamoDBService
    ): DynamicModule {
      return {
        module: DDBDatabaseModule,
        imports: [],
      };
    }
  }
