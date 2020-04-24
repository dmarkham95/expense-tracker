import { AppBar, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import UserMenu from './UserMenu';

const ToolbarLayout: React.FC = () => {
	return (

		<AppBar className="flex relative z-10" position="static">
			<Toolbar>
				<Typography variant="h6" color="inherit" noWrap>
					Expense Tracker
				</Typography>

                <div className="flex flex-1"></div>

                <div className="flex">
				<UserMenu />
			</div>
			</Toolbar>

			
		</AppBar>
	);
};

export default ToolbarLayout;
