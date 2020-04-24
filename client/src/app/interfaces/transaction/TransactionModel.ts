import { Action, Computed, Thunk } from 'easy-peasy';
import Transaction from './Transaction';
import Store from '../Store';

export default interface TransactionModel {
	transactions: Transaction[];
	setTransactions: Action<TransactionModel, Transaction[]>;
	addTransaction: Action<TransactionModel, Transaction>;
	removeTransaction: Action<TransactionModel, Transaction>;
	createTransaction: Thunk<TransactionModel, Transaction>;
	deleteTransaction: Thunk<TransactionModel, Transaction>;
	getTransactions: Thunk<TransactionModel,string>;
}
