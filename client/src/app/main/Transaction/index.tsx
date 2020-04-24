import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Container, Checkbox, FormControlLabel, Paper } from '@material-ui/core';
import Header from './Header';
import Balance from './Balance';
import IncomeExpenses from './IncomeExpenses';
import TransactionList from './TransactionList';
import AddTransaction from './AddTransaction';




const Transaction: React.FC = () => {


    return (
        <Container maxWidth="sm">
           
                <Header />
                <Balance />
                <IncomeExpenses />
                <AddTransaction />
                <TransactionList />

</Container>
    )
}


export default Transaction;