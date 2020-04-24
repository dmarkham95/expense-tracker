import TodoModel from './todo/TodoModel';
import UserModel from './auth/UserModel';
import GlobalModel from './global/GlobalStore';
import TransactionModel from './transaction/TransactionModel';

export default interface Store {
  todo: TodoModel;
  transaction: TransactionModel;
  auth: UserModel;
  global: GlobalModel;
}
