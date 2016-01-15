/**
 * @author Howard Chang
 */
// Libraries
import fetch from 'isomorphic-fetch';
// Constants
import * as actionTypes from '../constants/action-types';
import { SERVER_API_URL, SERVER_LOGIN_URL } from '../constants/config';
// Actions
import { setLoadingState } from './main-actions';

export function loginFailure(error) {
	return {
		type: actionTypes.LOGIN_FAILURE,
		error
	};
}

export function loginSuccess(token, user, isAuthenticated) {
	return {
		type: actionTypes.LOGIN_SUCCESS,
		token,
		user,
		isAuthenticated
	};
}

export function logout() {
	return {
		type: actionTypes.LOG_OUT
	};
};

export function login(user) {
	return (dispatch) => {
		let config = {
			method: 'POST',
			body: {
				'account': user.username,
				'password': user.password
			},
			headers: {
				'Content-Type': 'application/graphql',
				'x-access-token': localStorage.token
			}
		};
		dispatch(setLoadingState(true));
		return fetch(SERVER_LOGIN_URL, config)
			.then((res) => res.json())
			.then((body) => {
				dispatch(setLoadingState(false));
				dispatch(loginSuccess(body.token, body.user, true));
			})
			.catch((err) => {
				dispatch(setLoadingState(false));
				dispatch(loginFailure(err));
			});
	};
};

export function getCurrentUser() {
	return (dispatch) => {
		let config = {
			method: 'POST',
			body: `{
			    currentUser {
			    	name,
			    	birthday,
			    	token
			    }
			}`,
			headers: {
				'Content-Type': 'application/graphql',
				'x-access-token': localStorage.token
			}
		};
		return fetch(SERVER_API_URL, config)
			.then((res) => {
				if (res.status >= 300) {
					throw new Error(res.statusText);
				}
				return res.json();
			})
			.then((body) => {
				dispatch(loginSuccess(body.data.currentUser.token, body.data.currentUser.user, true));
			})
			.catch(() => {
				dispatch(loginFailure(''));
			});
	};
};
