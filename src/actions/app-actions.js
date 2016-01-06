// Libraries
import request from 'superagent';
// Constants
import * as actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';

export function loginFailure(error) {
	return {
		type: actionTypes.LOGIN_FAILURE,
		error
	};
}

export function setToken(token) {
	return {
		type: actionTypes.SET_TOKEN,
		token
	};
}

export function logout(cb) {
	return (dispatch) => {
		return request
			.post(SERVER_API_URL)
			.withCredentials()
			.set('Content-Type', 'application/graphql')
			.send(`
				mutation RootMutationType {
				    logout
				}
			`)
			.end((err, res) => {
				let response = JSON.parse(res.text);
				if (err || response.errors) {
					let error = err || response.errors[0].message;
					dispatch(loginFailure(error));
				}
				if (res) {
					dispatch(setToken(''));
				}
				cb();
			});
	};
};

export function login(user, success = () => {}, failure = () => {}) {
	return (dispatch) => {
		return request
			.post(SERVER_API_URL)
			.withCredentials()
			.set('Content-Type', 'application/graphql')
			.send(`
				mutation RootMutationType {
				    login(account:"${user['username']}", password:"${user['password']}")
				}
			`)
			.end((err, res) => {
				let response = JSON.parse(res.text);
				if (err || response.errors) {
					let error = err || response.errors[0].message;
					dispatch(loginFailure(error));
					failure();
				} else if (response) {
					if (!response.data.login) {
						dispatch(loginFailure('Invalid user name or password!'));
						failure();
					} else {
						dispatch(setToken(response.data.login));
						success();
					}
				}
			});
	};
};

export function checkLogin() {
	return (dispatch) => {
		return request
			.post(SERVER_API_URL)
			.set('Content-Type', 'application/graphql')
			.send(`{
			    isLogin
			}`)
			.end((err, res) => {
				let response = JSON.parse(res.text);
				if (err || response.errors) {
					let error = err || response.errors[0].message;
                    dispatch(loginFailure(error));
	            } else {
	                dispatch(setToken(response.data.isLogin));
	            }
			});
	};
};
