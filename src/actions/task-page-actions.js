/**
 * @author Howard Chang
 */

// Libraries
import request from 'superagent';
// Constants
import * as actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';
// Actions
import * as mainActions from './main-actions';

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

export function sortInternalFeatureTableByCategory(category) {
	return {
		type: actionTypes.SORT_INTERNAL_FEATURE_TABLE_BY_CATEGORY,
		category
	};
};

export function filterInternalFeatureTable(filterConditions) {
	return {
		type: actionTypes.FILTER_INTERNAL_FEATURE_TABLE,
		filterConditions
	};
};

export function resetInternalFeatureTable() {
	return {
		type: actionTypes.RESET_INTERNAL_FEATURE_TABLE
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

export function fetchInternalFeatureSuccess(data) {
	return {
		type: actionTypes.FETCH_INTERNAL_FEATURE_SUCCESS,
		data
	};
};

export function setDeleteWarningBoxState(state) {
	return {
		type: actionTypes.SET_DELETE_WARNING_BOX_STATE,
		state
	};
};

export function setSelectedItem(id) {
	return {
		type: actionTypes.SET_SELECTED_ITEM,
		id
	};
};

export function resetSelectedItem() {
	return {
		type: actionTypes.RESET_SELECTED_ITEM
	};
};

export function setFeatureModalState(state) {
	return {
		type: actionTypes.SET_FEATURE_MODAL_STATE,
		state
	};
};

export function fetchBug(callback = () => {}) {
	return (dispatch) => {
		return request
			.post(SERVER_API_URL)
			.set('Content-Type', 'application/graphql')
			.send(`{
			    tasks(taskType: "bug") {
			    	id,
			        title,
			        eta,
			        created,
			        pri,
			        severity,
			        status,
			        developer_email,
			        qa_email,
			        must_fix,
			        project
			    }
			}`)
			.end((err, res) => {
				if (err) {
                    dispatch(mainActions.apiFailure(err));
	            } else {
	            	let data = JSON.parse(res.text).data.tasks;
	                dispatch(fetchBugSuccess(data));
	            }
	            callback();
			});
	};
};

export function fetchFeature(callback = () => {}) {
	return (dispatch) => {
		return request
			.post(SERVER_API_URL)
			.set('Content-Type', 'application/graphql')
			.send(`{
			    tasks(taskType: "feature") {
			    	id,
			        title,
			        status,
			        total_percent,
			        dev_percent,
			        qa_percent,
			        days_to_complete,
			        completed_date,
			        owner_name,
			        dev_name,
			        qa_name,
			        project
			    }
			}`)
			.end((err, res) => {
				if (err) {
                    dispatch(mainActions.apiFailure(err));
	            } else {
	            	let data = JSON.parse(res.text).data.tasks;
	                dispatch(fetchFeatureSuccess(data));
	            }
	            callback();
			});
	};
};

export function fetchInternalFeature(callback = () => {}) {
	return (dispatch) => {
		return request
			.post(SERVER_API_URL)
			.set('Content-Type', 'application/graphql')
			.send(`{
			    tasks(taskType: "internal") {
			        title,
			        pri,
			        dev_percent,
			        dev_name,
			        owner_name,
			        project,
			        eta,
			        id
			    }
			}`)
			.end((err, res) => {
				if (err) {
                    dispatch(mainActions.apiFailure(err));
	            } else {
	            	let data = JSON.parse(res.text).data.tasks;
	                dispatch(fetchInternalFeatureSuccess(data));
	            }
	            callback();
			});
	};
};

export function fetchTaskPageData(callback = () => {}) {
	let tasks = [
		fetchBug,
		fetchFeature,
		fetchInternalFeature
	];
	let counter = 0;
	let checkAllTasksDone = () => {
		counter++;
		if (counter === tasks.length) {
			callback();
		}
	};

	return (dispatch) => {
		tasks.forEach((task) => {
			dispatch(task(checkAllTasksDone));
		});
	};
};

export function editETA(id, eta) {
	return (dispatch) => {
		dispatch(mainActions.setLoadingState(true));
		return request
			.post(SERVER_API_URL)
			.set('Content-Type', 'application/graphql')
			.send(`mutation RootMutationType {
			    editTaskEta(id:"${id}", eta:"${eta}") {
			        eta
			    }
			}`)
			.end((err, res) => {
				if (err || !res) {
					let error = err || 'No response';
					dispatch(mainActions.apiFailure(error));
				} else if (res && JSON.parse(res.text).errors) {
                    dispatch(mainActions.apiFailure(JSON.parse(res.text).errors[0].message));
	            } else {
	                dispatch(fetchBug());
	            }
			});
	};
};

export function initiateGK2Crawler(callback = () => {}) {
	return (dispatch) => {
		return request
			.post(SERVER_API_URL)
			.set('Content-Type', 'application/graphql')
			.send(`mutation RootMutationType {
			    initiateCrawler
			}`)
			.end((err, res) => {
				if (err || !res) {
					let error = err || 'No response';
					dispatch(mainActions.apiFailure(error));
				} else if (res && JSON.parse(res.text).errors) {
                    dispatch(mainActions.apiFailure(JSON.parse(res.text).errors[0].message));
	            } else {
	                dispatch(fetchTaskPageData(callback));
	            }
			});
	};
};

export function deleteSelectedItems(ids, callback = () => {}) {
	return (dispatch) => {
		return request
			.post(SERVER_API_URL)
			.set('Content-Type', 'application/graphql')
			.send(`mutation RootMutationType {
			    deleteInternalFeatures(ids:"${ids}")
			}`)
			.end((err, res) => {
				if (err || !res) {
					let error = err || 'No response';
					dispatch(mainActions.apiFailure(error));
				} else if (res && JSON.parse(res.text).errors) {
                    dispatch(mainActions.apiFailure(JSON.parse(res.text).errors[0].message));
	            } else {
	                dispatch(fetchInternalFeature(callback));
	            }
			});
	};
};

export function createFeature(data, callback = () => {}) {
	return (dispatch) => {
		return request
			.post(SERVER_API_URL)
			.set('Content-Type', 'application/graphql')
			.send(`mutation RootMutationType {
			    createInternalFeatures(data:"${JSON.stringify(data).replace(/\"/gi, '\\"')}")
			}`)
			.end((err, res) => {
				if (err || !res) {
					let error = err || 'No response';
					dispatch(mainActions.apiFailure(error));
				} else if (res && JSON.parse(res.text).errors) {
                    dispatch(mainActions.apiFailure(JSON.parse(res.text).errors[0].message));
	            } else {
	                dispatch(fetchInternalFeature(callback));
	            }
			});
	};
};

export function updateFeature(id, data, callback = () => {}) {
	return (dispatch) => {
		return request
			.post(SERVER_API_URL)
			.set('Content-Type', 'application/graphql')
			.send(`mutation RootMutationType {
			    updateInternalFeatures(id:"${id}", data:"${JSON.stringify(data).replace(/\"/gi, '\\"')}")
			}`)
			.end((err, res) => {
				if (err || !res) {
					let error = err || 'No response';
					dispatch(mainActions.apiFailure(error));
				} else if (res && JSON.parse(res.text).errors) {
                    dispatch(mainActions.apiFailure(JSON.parse(res.text).errors[0].message));
	            } else {
	                dispatch(fetchInternalFeature(callback));
	            }
			});
	};
};