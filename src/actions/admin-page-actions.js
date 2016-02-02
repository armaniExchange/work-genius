/**
 * @author Howard Chang
 */
// Libraries
import fetch from 'isomorphic-fetch';
// Constants
import * as actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';
// Actions
// import {
// 	setLoadingState,
// 	apiFailure
// } from './app-actions';
// import { setCurrentSelectedUserId } from './main-actions';

export function fetchUsersWithPrivilegeSuccess(data) {
    return {
		type: actionTypes.FETCH_USERS_WITH_PRIVILEGE_SUCCESS,
		data
	};
};

export function fetchUsersWithPrivilege() {
	return (dispatch) => {
		let config = {
			method: 'POST',
			body: `{
			    allUserWithPrivilege {
			    	id,
			    	name,
			    	privilege,
			    	privilege_display_name
			    }
			}`,
			headers: {
				'Content-Type': 'application/graphql',
				'x-access-token': localStorage.token
			}
		};
		return fetch(SERVER_API_URL, config)
			.then((res) => res.json())
			.then((body) => {
				dispatch(fetchUsersWithPrivilegeSuccess(body.data.allUserWithPrivilege));
			})
			.catch((err) => {
				throw new Error(err);
			});
	};
};