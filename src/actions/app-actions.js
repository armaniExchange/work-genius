// Libraries
import request from 'superagent';
// Constants
import * as actionTypes from '../constants/action-types';
import { SERVER_API_URL, SERVER_LOGIN_URL } from '../constants/config';

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

export function login(user, success = () => {}, failure = () => {}) {
	return () => {
		return request
			.post(SERVER_LOGIN_URL)
			.withCredentials()
			.send({
				'account': user.username,
				'password': user.password
			})
			.end((err, res) => {
				let response = JSON.parse(res.text);
				if (err) {
					failure(err);
				} else {
					success(response);
				}
			});
	};
};

export function getCurrentUser(success = () => {}, failure = () => {}) {
	return () => {
		return request
			.post(SERVER_API_URL)
			.set('Content-Type', 'application/graphql')
			.set('x-access-token', localStorage.token)
			.send(`{
			    currentUser {
			    	name,
			    	birthday,
			    	token
			    }
			}`)
			.end((err, res) => {
				let response = JSON.parse(res.text);
				if (err) {
                    failure(response);
	            } else {
	                success(response);
	            }
			});
	};
};
