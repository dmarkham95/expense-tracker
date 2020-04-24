import { TransactionDto } from "_ApplicationLayer/DTO/Transaction/transaction.dto";

export interface ITransactionService {
  getUserTransactions(userId: string): Promise<Array<TransactionDto>>;
  createTransaction(Transaction: TransactionDto): Promise<TransactionDto>;
  updateTransaction(Transaction: TransactionDto): Promise<void>;
  deleteTransaction(Transaction: TransactionDto): Promise<void>;
}
