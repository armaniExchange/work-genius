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

export function setPTOApplicationStatus(id, status) {
	console.log(id, status);
	return {
		type: 'SET_PTO_APPLICATION_STATUS',
		id,
		status
	};
};

export function fetchPTOApplicationsSuccess(data) {
	return {
		type: actionTypes.FETCH_PTO_APPLICATION_SUCCESS,
		data
	};
};

export function removePTOApplication(id) {
	console.log(`removing ${id}`);
	return {
		type: 'REMOVE_PTO_APPLICATION',
		id
	};
};

export function fetchPTOApplications(callback = () => {}) {
	return (dispatch) => {
		return request
			.post(SERVER_API_URL)
			.set('Content-Type', 'application/graphql')
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
			.set('Content-Type', 'application/graphql')
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