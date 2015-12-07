// Libraries
import jwt from 'jsonwebtoken';
// Constant
import { SECURE_KEY } from '../constants/config';

export function requireAuth(nextState, replaceState) {
	try {
		if (!localStorage.token) {
	    	replaceState({ nextPathname: nextState.location.pathname }, '/');
		} else {
			let user = jwt.verify(localStorage.token, SECURE_KEY);
		    if (!user.isLoggedIn) {
		    	replaceState({ nextPathname: nextState.location.pathname }, '/');
		    }
		}
	} catch (err) {
		alert('token expired');
		delete localStorage.token;
		replaceState({ nextPathname: nextState.location.pathname }, '/');
	}
};

export function redirectIfAuthorized(nextState, replaceState) {
	try {
		if (localStorage.token) {
			let user = jwt.verify(localStorage.token, SECURE_KEY);
		    if (user.isLoggedIn) {
		    	replaceState({ nextPathname: nextState.location.pathname }, '/main');
		    }
		}
	} catch (err) {
		console.log('token expired');
	}
};
