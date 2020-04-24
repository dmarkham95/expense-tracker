import React, { useEffect } from 'react';
import {
	Typography,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	CardContent,
	Card,
} from '@material-ui/core';
import { useStoreState, useStoreActions } from 'app/store/hooks';
import Transaction from 'app/interfaces/transaction/Transaction';
import DeleteIcon from '@material-ui/icons/Delete';
import useStyles from './styles/transactionItem';
import clsx from 'clsx';
import { AppUtils } from '@app';

type Props = {
	transaction: Transaction;
};

const TransactionItem: React.FC<Props> = (props: Props) => {
	const classes = useStyles({});
	const { transaction } = props;

	const deleteTransaction = useStoreActions(state => state.transaction.deleteTransaction);
	const showMessage = useStoreActions(state => state.global.message.showMessage);

	const sign = transaction.amount < 0 ? '-' : '+';

	const colorClass = transaction.amount < 0 ? classes.minus : classes.plus;

	const cardClass = transaction.amount < 0 ? classes.cardBorderMinus : classes.cardBorderPlus;

 
    const onDelete = async (transaction: Transaction) => {

        try {
            await deleteTransaction(transaction);
            showMessage({
              message: "Transaction Item Deleted",
              variant: "success",
            });
          } catch (error) {
           showMessage({
              message: "Error deleteing Transaction Item. Please try again",
              variant: "error",
            });
          }

    }

	return (
		<ListItem key={transaction.id}>
			<Card key={`card${transaction.id}`} className={cardClass}>
				<CardContent>
					<ListItemText
						primary={
							<Typography className={colorClass} variant="body1" color="textPrimary" gutterBottom>
								{sign}${AppUtils.numberWithCommas(Math.abs(transaction.amount))} ({transaction.description})
							</Typography>
						}
					/>
					<ListItemSecondaryAction>
						<IconButton style={{marginRight: "0"}} edge="end" aria-label="delete" onClick={() => onDelete(transaction)}>
							<DeleteIcon />
						</IconButton>
					</ListItemSecondaryAction>
				</CardContent>
			</Card>
		</ListItem>
	);
};

export default TransactionItem;
