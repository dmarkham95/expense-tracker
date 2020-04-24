import { authRoles } from "app/auth";
import React from "react";
import AppRouteConfig from "app/interfaces/routes/AppRouteConfig";

export const RegisterConfig: AppRouteConfig = {
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
			path: "/signup",
			component: React.lazy(() => import("./Register")),
		},
	],
};
