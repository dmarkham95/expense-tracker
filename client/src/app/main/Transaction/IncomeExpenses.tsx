import React, { useEffect } from 'react';
import { Typography, Grid, Paper, Divider } from '@material-ui/core';
import { useStoreState, useStoreActions } from 'app/store/hooks';
import useStyles from './styles/incomeExpenses';
import clsx from 'clsx';
import { AppUtils } from '@app';

const IncomeExpenses: React.FC = () => {
	const classes = useStyles({});
	const transactions = useStoreState(state => state.transaction.transactions);
	const amounts = transactions.map(transaction => transaction.amount);

	const incomeAmount = amounts
		.filter(item => item > 0)
		.reduce((acc, item) => (acc += item), 0)
		.toFixed(2);

	const expenseAmount = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);


	return (
		<div>
			<div className={classes.root}>
				<Paper className={classes.paper}>
					<div style={{flex: 1}}>
						<Typography  component="h6" variant="h6" align="center" color="textPrimary" gutterBottom>
							Income
						</Typography>
						<Typography className={classes.plus} variant="body1" align="center" color="textPrimary" gutterBottom>
							${AppUtils.numberWithCommas(incomeAmount)}
						</Typography>
					</div>
                    <Divider orientation="vertical" flexItem />
					<div style={{flex: 1}}>
						<Typography component="h6" variant="h6" align="center" color="textPrimary" gutterBottom>
							Expense
						</Typography>
						<Typography className={classes.minus} variant="body1" align="center" color="textPrimary" gutterBottom>
							${AppUtils.numberWithCommas(expenseAmount)}
						</Typography>
					</div>
				</Paper>
			</div>
		</div>
	);
};

export default IncomeExpenses;
