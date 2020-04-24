import React, { useEffect } from 'react';
import { Typography, Grid, Paper } from '@material-ui/core';
import { useStoreState, useStoreActions } from 'app/store/hooks';
import { AppUtils } from '@app';


const Balance: React.FC = () => {
	
	const transactions = useStoreState(state => state.transaction.transactions);
	const amounts = transactions.map(transaction => transaction.amount);
	const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);


	return (
		<div>
			<Typography component="h6" variant="h6" color="textPrimary" gutterBottom>
				Your Balance
			</Typography>
			<Typography component="h4" variant="h4" color="textPrimary" gutterBottom>
				${AppUtils.numberWithCommas(total)}
			</Typography>

			
		</div>
	);
};

export default Balance;
