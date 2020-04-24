import React, { useState, ReactNode, useEffect } from "react";
import AppSplashScreen from "@app/components/AppSplashScreen/AppSplashScreen";
import { useStoreActions } from "app/store/hooks";
import { authService } from "app/services/apiServices/auth-service";

type Props = { children: ReactNode };

const Auth: React.FC<Props> = (props?: Props) => {
    const [waitAuthCheck, setWaitAuthCheck] = useState(true);
    const showMessage = useStoreActions(state => state.global.message.showMessage);
    const loginWithToken = useStoreActions(state => state.auth.loginWithToken);

    useEffect(() => {
		async function onAuthChecker() {
			await authCheck().then(() => setWaitAuthCheck(false));
		}
		onAuthChecker();
    }, []);
    
    if (!props) {
		return null;
    }
    
    const authCheck = async () => {
        authService.init();
        await loginWithToken();
    }

	return waitAuthCheck ? (
		<AppSplashScreen />
	) : (
		<React.Fragment>{props.children}</React.Fragment>
	);
};


export default Auth;