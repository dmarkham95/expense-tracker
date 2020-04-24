import ErrorBoundary from './main/Error/error-boundary/ErrorBoundary';
import AppContext from './AppContext';
import routes from './app-configs/routesConfig';
import { StoreProvider } from 'easy-peasy';
import store from './store';
import Auth from './auth/Auth';
import history from "../appHistory";
import { Router } from 'react-router';
import React from 'react';
import { AppAuthorization } from '@app';
import AppLayout from '@app/components/AppLayout/AppLayout';


const App: React.FC = () => {
	return (
		<ErrorBoundary>
			<AppContext.Provider value={{ routes }}>
				<StoreProvider store={store}>
                    <Auth>
                        <Router history={history}>
                            <AppAuthorization>
                                <AppLayout/>
                            </AppAuthorization> 
                        </Router>
                    </Auth>
                </StoreProvider>
			</AppContext.Provider>
		</ErrorBoundary>
	);
};

export default App;
