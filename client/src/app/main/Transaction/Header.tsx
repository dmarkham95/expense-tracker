import React, { useEffect } from 'react';
import { Typography } from '@material-ui/core';




const Header: React.FC = () => {


    return (
        <Typography component="h4" variant="h4" color="textPrimary" gutterBottom>
                Expense Tracker
        </Typography>
    )
}


export default Header;