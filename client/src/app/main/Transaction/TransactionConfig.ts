import AppRouteConfig from 'app/interfaces/routes/AppRouteConfig';
import React from 'react';
import { authRoles } from 'app/auth';


export const TransactionConfig: AppRouteConfig = {
    auth: authRoles.user,
    routes: [
        {path: "/transactions",
        component: React.lazy(() => import("./index")),
    }
    ]
}