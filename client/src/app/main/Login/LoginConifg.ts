import { authRoles } from "app/auth";
import React from "react";
import AppRouteConfig from "app/interfaces/routes/AppRouteConfig";

export const LoginConfig: AppRouteConfig = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false,
				},
				toolbar: {
					display: false,
				},
				footer: {
					display: false,
				},
				leftSidePanel: {
					display: false,
				},
				rightSidePanel: {
					display: false,
				},
			},
		},
	},
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: "/login",
			component: React.lazy(() => import("./Login")),
		},
	],
};
