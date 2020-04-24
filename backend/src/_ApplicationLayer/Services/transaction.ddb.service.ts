import { Inject, Injectable } from '@nestjs/common';
import { TransactionMapper } from '_ApplicationLayer/Mappers';
import { IdGenerator } from '_Common/Utilities/Generators/id.generator';
import { ITransactionRepository } from '_DomainLayer/Repositories/DynamoDB/ITransactionRepository.ddb';
import { ITransactionService } from '_DomainLayer/Services/ITransactionService';
import { TransactionDto } from '_ApplicationLayer/DTO/Transaction/transaction.dto';
import * as moment from 'moment';

@Injectable()
export class TransactionDDBService implements ITransactionService {
  

  private transactionRepository: ITransactionRepository;

  constructor(@Inject('DDBTransactionRepository') transactionRepository: ITransactionRepository ) {
    this.transactionRepository = transactionRepository;
  }

  public async getUserTransactions(userId: string): Promise<TransactionDto[]> {
    try {
      let transactions: TransactionDto[] = [];
      let transactionList = await this.transactionRepository.getAllTransaction(userId);
      transactions = transactionList.map(u => TransactionMapper.toDTO(u));
      return transactions;
    } catch (error) {
      throw error;
    }
  }

  public async createTransaction(transaction: TransactionDto): Promise<TransactionDto> {
    try {

      let transactionId = IdGenerator.generateRandomId();
      
      transaction.id = transactionId;

      let ddbTransaction = TransactionMapper.toDomain(transaction);

      ddbTransaction.CreatedAt = moment.utc().format();
      ddbTransaction.UpdatedAt = moment.utc().format();
      
      await this.transactionRepository.createTransaction(ddbTransaction);

      return transaction;

    } catch (error) {
      throw error;
    }
  }
  
  public async updateTransaction(transaction: TransactionDto): Promise<void> {

    try {
      
    let ddbTransaction = TransactionMapper.toDomain(transaction);

    ddbTransaction.UpdatedAt = moment.utc().format();
      
    await this.transactionRepository.updateTransaction(ddbTransaction);

    } catch (error) {
      throw error;
    }

  }

  public async deleteTransaction(transaction: TransactionDto): Promise<void> {

    try {
      await this.transactionRepository.deleteTransaction(transaction.id,transaction.userId);
    } catch (error) {
      throw error;
    }
    
  }


}
