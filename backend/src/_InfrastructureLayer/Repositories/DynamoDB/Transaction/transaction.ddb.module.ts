import { DynamicModule, Module } from '@nestjs/common';
import { IDynamoDBService } from '_DomainLayer/Services/IAwsService';
import { repositoryFactory } from '../utils/utils';
import { DDBTransactionRepository } from './Transaction.ddb.repository';



@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class DDBTransactionRepoModule {

  
  public static withConfig(dynamodbService: IDynamoDBService): DynamicModule {

    const repo = repositoryFactory(DDBTransactionRepository,dynamodbService,);
    
    return {
      module: DDBTransactionRepoModule,
      providers: [repo],
      exports: [repo],
    };
  }


}
