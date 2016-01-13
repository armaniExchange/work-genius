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

export function setToken(token) {
	return {
		type: actionTypes.SET_TOKEN,
		token
	};
}

export function setCurrentUser(user) {
	return {
		type: actionTypes.SET_CURRENT_USER,
		user
	};
}

export function logout(cb) {
	localStorage.removeItem('token');
	cb();
	return setToken('');
};

export function login(user, success = () => {}, failure = () => {}) {
	return (dispatch) => {
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
					dispatch(loginFailure(err));
					failure();
				} else {
					dispatch(setToken(response.token));
					success();
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
			    	birthday
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
