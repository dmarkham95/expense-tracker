import UserModel from 'app/interfaces/auth/UserModel';
import { action, thunk, computed } from 'easy-peasy';
import { authService } from 'app/services/apiServices/auth-service';
import User from 'app/interfaces/auth/User';
import { stat } from 'fs';

export const initialUser: User = {
	id: '',
	roles: [], //guest
	displayName: '',
	photoURL: null,
	email: '',
};

const AuthStore: UserModel = {
	currentUser: initialUser,
	setCurrentUser: action((state, payload) => {
		state.currentUser = payload;
	}),
	logoutUser: action((state, payload) => {
		authService.logout();
		state.currentUser = initialUser;
	}),
	login: thunk(async (state, entry) => {
		let user = await authService.login(entry);
		state.setCurrentUser(user);
	}),
	signUp: thunk(async (state, entry) => {
		let user = await authService.signUp(entry);
		state.setCurrentUser(user);
	}),
	loginWithToken: thunk(async (state) => {
		try {
			let user = await authService.loginWithToken();
			state.setCurrentUser(user);
		} catch (error) {
			state.setCurrentUser(initialUser);
		}
	}),
};

export default AuthStore;
