import useStyles from './styles';
import React from 'react';
import { Toolbar, Typography, AppBar } from '@material-ui/core';
import AppContext from 'app/AppContext';
import { renderRoutes } from 'react-router-config';
import { AppSuspense, AppMessage } from '@app';
import { useLocation } from 'react-router-dom';
import ToolbarLayout from './components/ToolbarLayout';

type Props = {
	children?: React.ReactNode;
};

function MainLayout(props: Props) {
	const classes = useStyles();
	const location = useLocation();
	const { pathname } = location;
	const isLoginPage: boolean = pathname.indexOf('login') > -1;
	const isSignupPage: boolean = pathname.indexOf('signup') > -1;

	return (
		<AppContext.Consumer>
			{({ routes }) => (
				<React.Fragment>
					{!isLoginPage && !isSignupPage && <ToolbarLayout />}
					<div style={{marginTop: "25px"}}>
						<AppSuspense>{renderRoutes(routes)}</AppSuspense>
						{props.children}
					</div>
					<AppMessage />
				</React.Fragment>
			)}
		</AppContext.Consumer>
	);
}

export default MainLayout;
