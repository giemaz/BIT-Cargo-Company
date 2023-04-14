// client\src\shared\context\auth-context.js
import { createContext } from 'react';

export const AuthContext = createContext({
	isLoggedIn: false,
	userId: null,
	token: null,
	username: null,
	image: null,
	login: () => {},
	logout: () => {},
});
