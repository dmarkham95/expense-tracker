import React, { useEffect } from 'react';
import { Typography, List } from '@material-ui/core';
import { useStoreState, useStoreActions } from 'app/store/hooks';
import TransactionItem from './TransactionItem';
import { AppSplashScreen } from '@app';

const TransactionList: React.FC = () => {
    const currentUser = useStoreState(state => state.auth.currentUser);
    const transactions = useStoreState(state => state.transaction.transactions);
	const getTransactions = useStoreActions(state => state.transaction.getTransactions);
	const [loading, setLoading] = React.useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			await getTransactions(currentUser.id);
			setLoading(false);
		};
		fetchData();
	}, []); // eslint-disable-line

	if (loading) {
		return <AppSplashScreen />;
	}

	return (
		<div>
			<Typography style={{paddingLeft: "16px",paddingRight: "16px"}} component="h6" variant="h6" color="textPrimary" gutterBottom>
				History
			</Typography>
            <List>
            {transactions.map(transaction => (
					<TransactionItem key={transaction.id} transaction={transaction} />
				))}
            </List>
			
		</div>
	);
};

export default TransactionList;
