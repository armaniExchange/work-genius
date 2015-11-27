// Libraries
import request from 'superagent';
// import request from 'request';
// Constants
// import * as actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';

export function handleLogout() {
	return {
		type: 'logout'
	};
};


export function handleLogin(user) {
	
	// console.log('handelLogin');
	return () => {
		// dispatch(setLoadingState(true));
		//console.log(dispatch);
		return request
			.post(SERVER_API_URL)
			.withCredentials()
			// .set('Access-Control-Allow-Origin', 'localhost')
			.set('Content-Type', 'application/graphql')
			.send(`
				mutation RootMutationType {
				    login(account:"${user['username']}", password:"${user['password']}") {
				        title
				    }
				}				
			`)
			.end((err, res) => {
				if (res) {
					console.log(res, err);
				}
			});
	};
};
