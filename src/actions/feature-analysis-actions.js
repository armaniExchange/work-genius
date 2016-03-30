/**
 * @author Howard Chang
 */
// Libraries
import fetch from 'isomorphic-fetch';
// Constants
import * as actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';
// Actions
import {
	setLoadingState,
	apiFailure
} from './app-actions';


export function fetchAssignmentCategoriesSuccess(data) {
	return {
		type: actionTypes.FETCH_ASSIGNMENT_CATEGORIES_SUCCESS,
		data
	};
}

export function fetchAssignmentCategories() {
	return (dispatch) => {
		let config = {
			method: 'POST',
			body: `{
			    allAssignmentCategories {
			    	id,
			        parentId,
					name,
					path
			    }
			}`,
			headers: {
				'Content-Type': 'application/graphql',
				'x-access-token': localStorage.token
			}
		};
		dispatch(setLoadingState(true));
		return fetch(SERVER_API_URL, config)
			.then((res) => res.json())
			.then((body) => {
				dispatch(setLoadingState(false));
				dispatch(fetchAssignmentCategoriesSuccess(body.data.allAssignmentCategories));
			})
			.catch((err) => {
				dispatch(setLoadingState(false));
				dispatch(apiFailure(err));
			});
	};
};
