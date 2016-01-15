/**
 * @author Howard Chang
 */
import { SERVER_API_URL } from '../constants/config.js';
import fetch from 'isomorphic-fetch';

export const CALL_GRAPHQL_API = Symbol('Call graphql API');
export default store => next => action => {
	let metadata = action[CALL_GRAPHQL_API],
	    token = localStorage.getItem('token'),
	    tokenError = false,
		headers = new Headers({
			'Content-Type': 'application/graphql'
		}),
	    config = {};

	if (metadata === undefined) {
		return next(action);
	}

	console.log(store);

	let {
		body,
		needAuthentication,
		types
	} = metadata;

	const [REQUEST_TYPE, SUCCESS_TYPE, ERROR_TYPE] = types;

	if (needAuthentication) {
		if (token) {
			headers.append('x-access-token', token);
		} else {
			tokenError = true;
		}
	}
	config = {
		method: 'POST',
		body,
		headers
	};


	next({
		type: REQUEST_TYPE
	});
	return fetch(SERVER_API_URL, config).then((res) => {
		if (res.status >= 300 || !res.ok || tokenError) {
			let errorMessage = tokenError || res.statusText;
			throw new Error(errorMessage);
		}
		return res.json();
	})
	.then((json) => {
		next({
			type: SUCCESS_TYPE,
			res: json
		});
	})
	.catch((err) => {
		next({
			type: ERROR_TYPE,
			err: err
		});
	});
};