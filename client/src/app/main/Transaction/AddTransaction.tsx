import React, { useEffect, useState } from 'react';
import { Typography, TextField, Box, Button } from '@material-ui/core';
import { useStoreState, useStoreActions } from 'app/store/hooks';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import Transaction from 'app/interfaces/transaction/Transaction';
import useStyles from './styles/addTransaction';
import clsx from 'clsx';

const TransactionEntrySchema = yup.object().shape({
	description: yup
		.string()
		.trim()
		.min(5, 'Must be at least 5 characters.')
		.max(30, 'Can be no longer than 30 characters')
        .required('Required.'),
    amount: yup
		.number()
		.required('Required.'),
});

const AddTransaction: React.FC = () => {
	const classes = useStyles({});
	const user = useStoreState(state => state.auth.currentUser);
	const createTransaction = useStoreActions(state => state.transaction.createTransaction);
    const { register, handleSubmit, errors, reset } = useForm<Transaction>({
		validationSchema: TransactionEntrySchema,
	});
	const showMessage = useStoreActions(state => state.global.message.showMessage);

    const onSubmit = async (data: Transaction) => {
		data.userId = user.id;
    
    try {
	  await createTransaction(data);  
	  showMessage({
        message: "Transaction Item Saved",
        variant: "success",
      });
    } catch (error) {
     showMessage({
        message: "Error creating Transaction Item. Please try again",
        variant: "error",
      });
    }
		
		reset();
    };
    


	return (
		<div style={{marginBottom: "20px"}}>
			<Typography variant="h6" color="textPrimary" gutterBottom>
            Add New Transaction
			</Typography>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
				inputRef={register}
				className={clsx(classes.m10)}
				label="Description"
				name="description"
				fullWidth
				variant="outlined"
				error={!!errors.description}
				helperText={errors.description ? errors.description.message : ''}
			/>

            <TextField
				inputRef={register}
				label="Amount (negative - expense, positive - income)"
                name="amount"
				type="number"
				className={clsx(classes.m10,classes.number)}
				fullWidth
				variant="outlined"
				error={!!errors.amount}
				helperText={errors.amount ? errors.amount.message : ''}
			/>

			<Box className={clsx(classes.m10)} display="flex" justifyContent="flex-end">
				<Button type="submit" color="primary" variant="contained">
                Add New Transaction
				</Button>
			</Box>
            </form>
		</div>
	);
};

export default AddTransaction;
