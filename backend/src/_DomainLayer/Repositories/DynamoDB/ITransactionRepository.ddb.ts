import { DDBTransaction } from "_DomainLayer/Entities/DynamoDB/Transaction.ddb";
import { DDBRepository } from "_InfrastructureLayer/Repositories/DynamoDB/dynamodb.repository";

export interface ITransactionRepository extends DDBRepository{
  getAllTransaction(userId: string): Promise<Array<DDBTransaction>>;
  createTransaction(transaction: DDBTransaction): Promise<void>;
  updateTransaction(transaction: DDBTransaction): Promise<void>;
  deleteTransaction(transaction: string,userId: string): Promise<void>;
}
