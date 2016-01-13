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

export function fetchPTOApplications(callback = () => {}) {
	return (dispatch) => {
		return request
			.post(SERVER_API_URL)
			.withCredentials()
			.set('Content-Type', 'application/graphql')
			.set('x-access-token', localStorage.token)
			.send(`{
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
			}`)
			.end((err, res) => {
				if (err) {
                    dispatch(mainActions.apiFailure(err));
	            } else {
	            	let data = JSON.parse(res.text).data.ptoApplications;
	                dispatch(fetchPTOApplicationsSuccess(data));
	            }
	            callback();
			});
	};
};

export function createPTOApplication(data, callback = () => {}) {
    return (dispatch) => {
		return request
			.post(SERVER_API_URL)
			.withCredentials()
			.set('Content-Type', 'application/graphql')
			.set('x-access-token', localStorage.token)
			.send(`mutation RootMutationType {
			    createPTOApplication(data:"${JSON.stringify(data).replace(/\"/gi, '\\"')}")
			}`)
			.end((err, res) => {
				if (err || !res) {
					let error = err || 'No response';
					dispatch(mainActions.apiFailure(error));
				} else if (res && JSON.parse(res.text).errors) {
                    dispatch(mainActions.apiFailure(JSON.parse(res.text).errors[0].message));
	            } else {
	                dispatch(fetchPTOApplications(callback));
	            }
			});
	};
};

export function removePTOApplication(id, callback = () => {}) {
	return (dispatch) => {
		return request
			.post(SERVER_API_URL)
			.withCredentials()
			.set('Content-Type', 'application/graphql')
			.set('x-access-token', localStorage.token)
			.send(`mutation RootMutationType {
			    deletePTOApplication(id:"${id}")
			}`)
			.end((err, res) => {
				if (err || !res) {
					let error = err || 'No response';
					dispatch(mainActions.apiFailure(error));
				} else if (res && JSON.parse(res.text).errors) {
                    dispatch(mainActions.apiFailure(JSON.parse(res.text).errors[0].message));
	            } else {
	                dispatch(fetchPTOApplications(callback));
	            }
			});
	};
};

export function setPTOApplicationStatus(id, status, callback = () => {}) {
	return (dispatch) => {
		return request
			.post(SERVER_API_URL)
			.withCredentials()
			.set('Content-Type', 'application/graphql')
			.set('x-access-token', localStorage.token)
			.send(`mutation RootMutationType {
			    updatePTOApplicationStatus(id:"${id}", status:"${status}")
			}`)
			.end((err, res) => {
				if (err || !res) {
					let error = err || 'No response';
					dispatch(mainActions.apiFailure(error));
				} else if (res && JSON.parse(res.text).errors) {
                    dispatch(mainActions.apiFailure(JSON.parse(res.text).errors[0].message));
	            } else {
	                dispatch(fetchPTOApplications(callback));
	            }
			});
	};
};