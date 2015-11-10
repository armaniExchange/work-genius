// Libraries
import request from 'superagent';
// Constants
import * as actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';


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

export function fetchTaskFailure(err) {
	return {
		type: actionTypes.FETCH_TASK_FAILURE,
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
			        developer,
			        title,
			        pri,
			        status,
			        dev_progress,
			        qa_progress,
			        qa,
			        project,
			        eta,
			        task_id
			    }
			}`)
			.end((err, res) => {
				if (err) {
                    dispatch(fetchTaskFailure(err));
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
			        developer,
			        title,
			        pri,
			        status,
			        dev_progress,
			        project,
			        eta,
			        task_id
			    }
			}`)
			.end((err, res) => {
				if (err) {
                    dispatch(fetchTaskFailure(err));
	            } else {
	            	let data = JSON.parse(res.text).data.tasks;
	                dispatch(fetchFeatureSuccess(data));
	            }
			});
	};
};
