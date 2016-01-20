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

export function setPTOApplyModalState(state) {
    return {
		type: actionTypes.SET_PTO_APPLY_MODAL_STATE,
		state
	};
};

export function filterPTOTable(filterConditions) {
	return {
		type: actionTypes.FILTER_PTO_TABLE,
		filterConditions
	};
};

export function sortPTOTableByCategory(category) {
	return {
		type: actionTypes.SORT_PTO_TABLE_BY_CATEGORY,
		category
	};
};

export function fetchPTOApplicationsSuccess(data) {
	return {
		type: actionTypes.FETCH_PTO_APPLICATION_SUCCESS,
		data
	};
};

export function setApplicantToFilter(applicant) {
	return {
		type: actionTypes.SET_APPLICANT_NAME_TO_FILTER,
		applicant
	};
};

export function fetchPTOApplications() {
	return (dispatch) => {
		let config = {
			method: 'POST',
			body: `{
			    ptoApplications {
			    	id,
			        start_date,
			        end_date,
			        hours,
			        applicant,
			        apply_date,
			        status,
			        memo
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
				dispatch(fetchPTOApplicationsSuccess(body.data.ptoApplications));
			})
			.catch((err) => {
				dispatch(setLoadingState(false));
				dispatch(apiFailure(err));
			});
	};
};

export function createPTOApplication(data) {
	return (dispatch) => {
		let config = {
			method: 'POST',
			body: `mutation RootMutationType {
			    createPTOApplication(data:"${JSON.stringify(data).replace(/\"/gi, '\\"')}")
			}`,
			headers: {
				'Content-Type': 'application/graphql',
				'x-access-token': localStorage.token
			}
		};
		dispatch(setPTOApplyModalState(false));
		dispatch(setLoadingState(true));
		return fetch(SERVER_API_URL, config)
			.then((res) => res.json())
			.then(() => {
				dispatch(setLoadingState(false));
				dispatch(fetchPTOApplications());
			})
			.catch((err) => {
				dispatch(setLoadingState(false));
				dispatch(apiFailure(err));
			});
	};
};

export function removePTOApplication(id) {
	return (dispatch) => {
		let config = {
			method: 'POST',
			body: `mutation RootMutationType {
			    deletePTOApplication(id:"${id}")
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
				dispatch(fetchPTOApplications());
			})
			.catch((err) => {
				dispatch(setLoadingState(false));
				dispatch(apiFailure(err));
			});
	};
};

export function setPTOApplicationStatus(id, status) {
	return (dispatch) => {
		let config = {
			method: 'POST',
			body: `mutation RootMutationType {
			    updatePTOApplicationStatus(id:"${id}", status:"${status}")
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
				dispatch(fetchPTOApplications());
			})
			.catch((err) => {
				dispatch(setLoadingState(false));
				dispatch(apiFailure(err));
			});
	};
};

export function fetchUsersWithPTO() {
	return (dispatch) => {
		let config = {
			method: 'POST',
			body: `{
			    allUserWithPto {
			    	name,
			    	pto {
			    		end_date
			    	}
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
				console.log(body);
			})
			.catch((err) => {
				dispatch(setLoadingState(false));
				dispatch(apiFailure(err));
			});
	};
};