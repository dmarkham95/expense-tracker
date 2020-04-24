import { ErrorPageConfig } from 'app/main/Error/ErrorPageConfig';
import AppRouteConfig from 'app/interfaces/routes/AppRouteConfig';
import * as React from 'react';
import { Redirect } from 'react-router';
import { AppUtils } from '@app';
import { LandingPageConfig } from 'app/main/LandingPage/LandingPageConfig';
import { LoginConfig } from 'app/main/Login/LoginConifg';
import { RegisterConfig } from 'app/main/Register/RegisterConfig';
import { TodoConfig } from 'app/main/Todo/TodoConfig';
import { TransactionConfig } from 'app/main/Transaction/TransactionConfig';

const routeConfigs = [TodoConfig,ErrorPageConfig,LandingPageConfig,LoginConfig,TransactionConfig,RegisterConfig];

const routes: AppRouteConfig[] = [
	...AppUtils.generateRoutesFromConfigsV2(routeConfigs),
	{
		path: '/',
		exact: true,
		component: () => <Redirect to="/landing" />,
	},
	{
		component: () => <Redirect to="/error-404" />,
	},
];



export default routes;
