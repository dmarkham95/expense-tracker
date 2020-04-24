import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Api } from './_Api';
import Transaction from 'app/interfaces/transaction/Transaction';
import { apiConfig } from './_api-config';

class TransactionService extends Api {
	public constructor(config: AxiosRequestConfig) {
		super(config);
	}

	public getTransactions = async (userId: string): Promise<Array<Transaction>> => {
		const transactions = await this.get<Array<Transaction>>(`transactions?userId=${userId}`);
		return transactions.data;
	};

	public createTransaction = async (data: Transaction): Promise<Transaction> => {
		let transaction = await this.post<Transaction>(`transactions/create`, data);
		return transaction.data;
	}

	public deleteTransaction = async (data: Transaction): Promise<void> => {
		await this.post<Transaction>(`transactions/delete`, data);
		
	};

}

export const transactionService = new TransactionService(apiConfig);
