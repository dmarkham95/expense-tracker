import { createStore } from 'easy-peasy';

import Store from '../interfaces/Store';
import TodoStore from 'app/main/Todo/store';
import AuthStore from 'app/auth/store';
import GlobalStore from './global';
import TransactionStore from 'app/main/Transaction/store';

const store: Store = {
  todo: TodoStore,
  transaction: TransactionStore,
  auth: AuthStore,
  global: GlobalStore
};

export default createStore<Store>(store);
