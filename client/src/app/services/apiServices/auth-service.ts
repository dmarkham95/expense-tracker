import { Api } from "./_Api";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import User from "app/interfaces/auth/User";
import UserCreds from "app/interfaces/auth/UserCreds";
import UserLogin from "app/interfaces/auth/UserLogin";
import { apiConfig } from './_api-config';
import { getItem, setItem, removeItem } from "../utils/localStorageService";

class AuthService extends Api {
    public constructor(config: AxiosRequestConfig) {
        super(config);
        
    }
    
    public init() {
		this.handleAuthentication();
    }
    
    public login = async (data: UserLogin): Promise<User> => {
        let user = await this.post<UserCreds>(`login`, data,
        {
            baseURL: process.env.REACT_APP_BASE_AUTH_URL,
        });

        this.setSession(user.data.accessToken)

        return user.data.user;
    };
    
    public loginWithToken = async (): Promise<User> => {
        let access_token = this.getAccessToken();
        let user = await this.post<UserCreds>(`token`, {token: access_token},
        {
            baseURL: process.env.REACT_APP_BASE_AUTH_URL,
        });

        this.setSession(user.data.accessToken)

        return user.data.user;
    };
    
    public signUp = async (data: UserLogin): Promise<User> => {
        let user = await this.post<UserCreds>(`signup`, data,
        {
            baseURL: process.env.REACT_APP_BASE_AUTH_URL,
        });
        this.setSession(user.data.accessToken)

        return user.data.user;
    };

    public logout = () => {
		this.setSession(null);
	};

    private getAccessToken = () => {
		return getItem("expense_tracker_access_token");
    };
    
    private setSession = (access_token: string) => {
		if (access_token) {
			setItem("expense_tracker_access_token", access_token);
		} else {
			removeItem("expense_tracker_access_token");
		}
    };
    
    private handleAuthentication = () => {
		let access_token = this.getAccessToken();
		this.setSession(access_token);
	};

}


export const authService = new AuthService(apiConfig);