import AppRouteConfig from 'app/interfaces/routes/AppRouteConfig';
import React from 'react';


export const TodoConfig: AppRouteConfig = {
    routes: [
        {path: "/todo",
        component: React.lazy(() => import("./index")),
    }
    ]
}