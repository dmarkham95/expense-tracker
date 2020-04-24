import { Action, Computed, Thunk } from 'easy-peasy';
import User from './User';
import UserLogin from './UserLogin';

export default interface UserModel {
	currentUser: User;
	setCurrentUser: Action<UserModel, User>;
	login: Thunk<UserModel, UserLogin>;
	signUp: Thunk<UserModel,UserLogin>;
	loginWithToken: Thunk<UserModel>;
	logoutUser: Action<UserModel>;
}
