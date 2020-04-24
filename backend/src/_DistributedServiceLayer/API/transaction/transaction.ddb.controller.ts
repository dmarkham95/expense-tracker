import { Body, Controller, Inject, Post, UsePipes, Get, Param, HttpException, HttpStatus, Query } from '@nestjs/common';
import { logger } from '_Common/Logger';
import { JoiValidationPipe } from '_Common/Pipes/JoiValidation.pipe';
import { ITransactionService } from '_DomainLayer/Services/ITransactionService';
import { createTransactionDtoSchema, TransactionDto, updateTransactionDtoSchema, deleteTransactionDtoSchema } from '_ApplicationLayer/DTO/Transaction/transaction.dto';

@Controller('transactions')
export class DDBTransactionController {
 private transactionServive: ITransactionService;

  constructor(@Inject('TransactionDDBService') transactionServive: ITransactionService) {
    this.transactionServive = transactionServive;
  }

  @Get()
  public async getTransactions(@Query("userId") userId: string): Promise<Array<TransactionDto>> {
    if(!userId){
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
    
   const transactions = await this.transactionServive.getUserTransactions(userId);
    return transactions;
  }


  @Post("create")
  @UsePipes(new JoiValidationPipe(createTransactionDtoSchema))
  public async create(@Body() dto: TransactionDto) {
    logger.info('Create Transaction', dto);
    
    const Transaction = await this.transactionServive.createTransaction(dto);

    return Transaction;
  }

  @Post("update")
  @UsePipes(new JoiValidationPipe(updateTransactionDtoSchema))
  public async update(@Body() dto: TransactionDto) {
    logger.info('Update Transaction', dto);
    
    await this.transactionServive.updateTransaction(dto);

    return;
  }

  @Post("delete")
  @UsePipes(new JoiValidationPipe(deleteTransactionDtoSchema))
  public async delete(@Body() dto: TransactionDto) {
    logger.info('Delete Transaction', dto);
    
    await this.transactionServive.deleteTransaction(dto);

    return;
  }
  


}
