/**
 * @author Howard Chang
 */
// Libraries
import fetch from 'isomorphic-fetch';
// Constants
import * as actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';
// Actions
import { setLoadingState, apiFailure } from './main-actions';

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

export function fetchBug() {
	return (dispatch) => {
		let config = {
			method: 'POST',
			body: `{
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
			}`,
			headers: {
				'Content-Type': 'application/graphql',
				'x-access-token': localStorage.token
			}
		};
		return fetch(SERVER_API_URL, config)
			.then((res) => res.json())
			.then((body) => {
				dispatch(fetchBugSuccess(body.data.tasks));
			})
			.catch((err) => {
				Promise.reject(err);
			});
	};
};

export function fetchFeature() {
	return (dispatch) => {
		let config = {
			method: 'POST',
			body: `{
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
			}`,
			headers: {
				'Content-Type': 'application/graphql',
				'x-access-token': localStorage.token
			}
		};
		return fetch(SERVER_API_URL, config)
			.then((res) => res.json())
			.then((body) => {
				dispatch(fetchFeatureSuccess(body.data.tasks));
			})
			.catch((err) => {
				Promise.reject(err);
			});
	};
};

export function fetchInternalFeature() {
	return (dispatch) => {
		let config = {
			method: 'POST',
			body: `{
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
			}`,
			headers: {
				'Content-Type': 'application/graphql',
				'x-access-token': localStorage.token
			}
		};
		return fetch(SERVER_API_URL, config)
			.then((res) => res.json())
			.then((body) => {
				dispatch(fetchInternalFeatureSuccess(body.data.tasks));
			})
			.catch((err) => {
				Promise.reject(err);
			});
	};
};

export function fetchTaskPageData() {
	return (dispatch) => {
		dispatch(setLoadingState(true));
		Promise.all([
			dispatch(fetchBug()),
			dispatch(fetchFeature()),
			dispatch(fetchInternalFeature())
		]).then(
			() => { dispatch(setLoadingState(false)); },
			(err) => {
				dispatch(setLoadingState(false));
				dispatch(apiFailure(err));
			}
		);
	};
};

export function initiateGK2Crawler() {
	return (dispatch) => {
		let config = {
			method: 'POST',
			body: `mutation RootMutationType {
			    initiateCrawler
			}`,
			headers: {
				'Content-Type': 'application/graphql',
				'x-access-token': localStorage.token
			}
		};
		dispatch(setLoadingState(true));
		return fetch(SERVER_API_URL, config)
			.then((res) => res.json())
			.then(() => {
				dispatch(setLoadingState(false));
				dispatch(fetchTaskPageData());
			})
			.catch((err) => {
				dispatch(setLoadingState(false));
				dispatch(apiFailure(err));
			});
	};
};

export function deleteSelectedItems(ids) {
	return (dispatch) => {
		let config = {
			method: 'POST',
			body: `mutation RootMutationType {
			    deleteInternalFeatures(ids:"${ids}")
			}`,
			headers: {
				'Content-Type': 'application/graphql',
				'x-access-token': localStorage.token
			}
		};
		dispatch(setDeleteWarningBoxState(false));
		dispatch(setLoadingState(true));
		return fetch(SERVER_API_URL, config)
			.then((res) => res.json())
			.then(() => {
				dispatch(setLoadingState(false));
				dispatch(resetSelectedItem());
				dispatch(fetchTaskPageData());
			})
			.catch((err) => {
				dispatch(setLoadingState(false));
				dispatch(resetSelectedItem());
				dispatch(apiFailure(err));
			});
	};
};

export function createFeature(data) {
	return (dispatch) => {
		let config = {
			method: 'POST',
			body: `mutation RootMutationType {
			    createInternalFeatures(data:"${JSON.stringify(data).replace(/\"/gi, '\\"')}")
			}`,
			headers: {
				'Content-Type': 'application/graphql',
				'x-access-token': localStorage.token
			}
		};
		dispatch(setFeatureModalState(false));
		dispatch(setLoadingState(true));
		return fetch(SERVER_API_URL, config)
			.then((res) => res.json())
			.then(() => {
				dispatch(setLoadingState(false));
				dispatch(resetSelectedItem());
				dispatch(fetchTaskPageData());
			})
			.catch((err) => {
				dispatch(setLoadingState(false));
				dispatch(resetSelectedItem());
				dispatch(apiFailure(err));
			});
	};
};

export function updateFeature(id, data) {
	return (dispatch) => {
		let config = {
			method: 'POST',
			body: `mutation RootMutationType {
			    updateInternalFeatures(id:"${id}", data:"${JSON.stringify(data).replace(/\"/gi, '\\"')}")
			}`,
			headers: {
				'Content-Type': 'application/graphql',
				'x-access-token': localStorage.token
			}
		};
		dispatch(setFeatureModalState(false));
		dispatch(setLoadingState(true));
		return fetch(SERVER_API_URL, config)
			.then((res) => res.json())
			.then(() => {
				dispatch(setLoadingState(false));
				dispatch(resetSelectedItem());
				dispatch(fetchTaskPageData());
			})
			.catch((err) => {
				dispatch(setLoadingState(false));
				dispatch(resetSelectedItem());
				dispatch(apiFailure(err));
			});
	};
};