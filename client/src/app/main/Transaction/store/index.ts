import { action, thunk, computed } from 'easy-peasy';
import { transactionService } from 'app/services/apiServices/transaction-service';
import * as _ from "lodash";
import TransactionModel from 'app/interfaces/transaction/TransactionModel';

const TransactionStore: TransactionModel = {
	transactions: [],
	setTransactions: action((state, payload) => {
		state.transactions = payload;
	}),
	addTransaction: action((state, payload) => {
		state.transactions.push(payload);
	}),
	removeTransaction: action((state, payload) => {
		state.transactions = _.reject(state.transactions, {
            id: payload.id,
        })
	}),
	createTransaction: thunk(async (state, entry): Promise<void> => {
		let newTransction = await transactionService.createTransaction(entry);
		state.addTransaction(newTransction);
    }),
    deleteTransaction: thunk(async (state, entry): Promise<void> => {
		await transactionService.deleteTransaction(entry);
		state.removeTransaction(entry);
	 	
	}),
	getTransactions: thunk(async (state,userId) => {
		const transactions = await transactionService.getTransactions(userId);
		state.setTransactions(transactions);
	}),
};

export default TransactionStore;
