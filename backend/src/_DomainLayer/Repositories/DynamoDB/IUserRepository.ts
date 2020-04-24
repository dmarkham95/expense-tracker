import { DDBUser } from "_DomainLayer/Entities/DynamoDB/user.ddb";
import { DDBRepository } from "_InfrastructureLayer/Repositories/DynamoDB/dynamodb.repository";


export interface IUserDDBRepository extends DDBRepository{
  getUserById(id: string): Promise<DDBUser | undefined>;
  getAll(accountId: string): Promise<Array<DDBUser>>;
}
