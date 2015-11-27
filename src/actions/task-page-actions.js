// Libraries
import request from 'superagent';
// Constants
import * as actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';

export function sortFeatureTableByCategory(category) {
	return {
		type: actionTypes.SORT_FEATURE_TABLE_BY_CATEGORY,
		category
	};
};

export function filterFeatureTable(filterConditions) {
	return {
		type: actionTypes.FILTER_FEATURE_TABLE,
		filterConditions
	};
};

export function resetFeatureTable() {
	return {
		type: actionTypes.RESET_FEATURE_TABLE
	};
};

export function sortBugTableByCategory(category) {
	return {
		type: actionTypes.SORT_BUG_TABLE_BY_CATEGORY,
		category
	};
};

export function filterBugTable(filterConditions) {
	return {
		type: actionTypes.FILTER_BUG_TABLE,
		filterConditions
	};
};

export function resetBugTable() {
	return {
		type: actionTypes.RESET_BUG_TABLE
	};
};

export function setLoadingState(state) {
	return {
		type: actionTypes.SET_LOADING_STATE,
		state
	};
};

export function fetchBugSuccess(data) {
	return {
		type: actionTypes.FETCH_BUG_SUCCESS,
		data
	};
};

export function fetchFeatureSuccess(data) {
	return {
		type: actionTypes.FETCH_FEATURE_SUCCESS,
		data
	};
};

export function taskApiFailure(err) {
	return {
		type: actionTypes.TASK_API_FAILURE,
		err
	};
};

export function fetchBug() {
	return (dispatch) => {
		dispatch(setLoadingState(true));
		return request
			.post(SERVER_API_URL)
			.set('Content-Type', 'application/graphql')
			.send(`{
			    tasks(taskType: "bug") {
			    	id,
			        developer_email,
			        title,
			        pri,
			        status,
			        qa_email,
			        project,
			        eta
			    }
			}`)
			.end((err, res) => {
				if (err) {
                    dispatch(taskApiFailure(err));
	            } else {
	            	let data = JSON.parse(res.text).data.tasks;
	                dispatch(fetchBugSuccess(data));
	            }
			});
	};
};

export function fetchFeature() {
	return (dispatch) => {
		dispatch(setLoadingState(true));
		return request
			.post(SERVER_API_URL)
			.set('Content-Type', 'application/graphql')
			.send(`{
			    tasks(taskType: "feature") {
			    	id,
			        developer_email,
			        title,
			        pri,
			        status,
			        qa_email,
			        project,
			        eta
			    }
			}`)
			.end((err, res) => {
				if (err) {
                    dispatch(taskApiFailure(err));
	            } else {
	            	let data = JSON.parse(res.text).data.tasks;
	                dispatch(fetchFeatureSuccess(data));
	            }
			});
	};
};

export function editETA(id, eta) {
	return (dispatch) => {
		dispatch(setLoadingState(true));
		return request
			.post(SERVER_API_URL)
			.set('Content-Type', 'application/graphql')
			.send(`mutation RootMutationType {
			    editTaskEta(id:"${id}", eta:"${eta}") {
			        eta
			    }
			}`)
			.end((err, res) => {
				let response = JSON.parse(res.text);
				if (err || response.errors) {
					let error = err || response.errors[0].message;
                    dispatch(taskApiFailure(error));
	            } else {
	                dispatch(fetchBug());
	            }
			});
	};
};
