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

export function fetchTasksSuccess(data) {
	return {
		type: actionTypes.FETCH_TASKS_SUCCESS,
		data
	};
};

export function fetchTasksFailure(err) {
	return {
		type: actionTypes.FETCH_TASKS_FAILURE,
		err
	};
};

export function fetchTasks() {
	return (dispatch) => {
		dispatch(setLoadingState(true));
		return request
			.post(SERVER_API_URL)
			.set('Content-Type', 'application/graphql')
			.send(`{
			    tasks {
			        developer,
			        title,
			        pri,
			        status,
			        devProgress,
			        qaProgress,
			        qa,
			        project,
			        eta
			    }
			}`)
			.end((err, res) => {
				if (err) {
                    dispatch(fetchTasksFailure(err));
	            } else {
	            	let data = JSON.parse(res.text).data.tasks;
	                dispatch(fetchTasksSuccess(data));
	            }
			});
	};
};
