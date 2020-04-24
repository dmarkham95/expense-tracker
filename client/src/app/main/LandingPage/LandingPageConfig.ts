import AppRouteConfig from 'app/interfaces/routes/AppRouteConfig';
import React from 'react';
import { authRoles } from 'app/auth';


export const LandingPageConfig: AppRouteConfig = {
    //auth: authRoles.user,
    routes: [
        {path: "/landing",
        component: React.lazy(() => import("./index")),
    }
    ]
}