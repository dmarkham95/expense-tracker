import { Module } from '@nestjs/common';
import { TransactionDDBService } from '_ApplicationLayer/Services/transaction.ddb.service';
import { DatabaseModule } from '../database.module';
import { DDBTransactionController } from './transaction.ddb.controller';
import { DDBTransactionRepository } from '_InfrastructureLayer/Repositories/DynamoDB/Transaction/transaction.ddb.repository';


@Module({
  imports: [DatabaseModule],
  controllers: [DDBTransactionController],
  providers: [DDBTransactionRepository,TransactionDDBService],
  exports: [TransactionDDBService],
})
export class TransactionDDBModule {}
