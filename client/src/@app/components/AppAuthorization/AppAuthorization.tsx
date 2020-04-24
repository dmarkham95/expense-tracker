import { RouteComponentProps, RouterProps, withRouter } from "react-router";
import React, { useContext, useState, useLayoutEffect, useEffect } from 'react';
import AppContext from "app/AppContext";
import { matchRoutes } from "react-router-config";
import { AppUtils } from "@app";
import { Location } from 'history';
import { useStoreState, useStoreActions } from 'app/store/hooks';

type BaseProps = {
	className?: string;
	style?: React.CSSProperties;
	children?: React.ReactNode;
	classess?: any;
	
};

type Props = {} & BaseProps & RouteComponentProps;

const AppAuthorization: React.FC<Props> = (props: Props) => {
    const { routes } = useContext(AppContext);
    const [accessGranted, setAccessGranted] = useState<boolean>(true);
    const { location, history } = props;
    const { pathname } = location;
    const matched = matchRoutes(routes, pathname)[0];

	const currentUser = useStoreState((state) => state.auth.currentUser);
    const userRole: string[] = currentUser ? currentUser.roles : [];
    
    useEffect(() => {
		if (!accessGranted) {
			redirectRoute();
        }
    }, []);
    
    useLayoutEffect(() => {

		if (!accessGranted) {
			redirectRoute();
		}
    });
    
    const isAccessGranted = matched ? AppUtils.hasPermission(matched.route.auth, userRole): true;

	if (isAccessGranted !== accessGranted) {
		setAccessGranted(isAccessGranted);
	}
	
	if((pathname === "/" || pathname === "/landing") && isAccessGranted && userRole.length !== 0){
		history.push({ pathname: "/transactions" });
	}
    
    const redirectRoute = () => {
		const { location, history } = props;
		const { pathname } = location;
		let _st = (location.state as any);
		const redirectUrl = _st && _st.redirectUrl ? _st.redirectUrl : "/";
		const redirectMatched = matchRoutes(routes, redirectUrl)[0];
		const hasPermission = redirectMatched
			? AppUtils.hasPermission(redirectMatched.route.auth, userRole)
			: true;
		/*
		  User is guest
		  Redirect to Login Page
		  */
		if (!userRole || userRole.length === 0) {
			// history.push({
			// 	pathname: "/login",
			// 	state: { redirectUrl: pathname },
            // });
            history.push("/login",{
                redirectUrl: pathname
            })
		} else {
			/*
		  User is member
		  User must be on unAuthorized page or just logged in
		  Redirect to dashboard or redirectUrl
		  */
			if (
				userRole &&
				userRole.length > 0 &&
				!accessGranted &&
				!hasPermission
			) {
				history.push({ pathname: "/unauthorized" });
			} else {
				history.push({ pathname: redirectUrl });
			}
		}
    };
    
    return accessGranted ? (
		<React.Fragment>{props.children}</React.Fragment>
	) : null;
}


export default withRouter(React.memo(AppAuthorization));