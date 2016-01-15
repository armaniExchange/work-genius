/**
 * @author Howard Chang
 */
// Constants
import * as actionTypes from '../constants/action-types';
import { CALL_GRAPHQL_API } from '../middlewares/graphql-api.js';

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

export function fetchPTOApplicationsRequest() {
	return {
		type: actionTypes.FETCH_PTO_APPLICATION_REQUEST
	};
};

export function fetchPTOApplicationsSuccess(data) {
	return {
		type: actionTypes.FETCH_PTO_APPLICATION_SUCCESS,
		data
	};
};

export function fetchPTOApplications() {
	return {
		[CALL_GRAPHQL_API]: {
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
			types: [
			    actionTypes.FETCH_PTO_APPLICATION_REQUEST,
			    actionTypes.FETCH_PTO_APPLICATION_SUCCESS,
			    actionTypes.API_FAILURE
			],
			needAuthentication: true
		}
	};
};

export function createPTOApplication(data) {
	return {
		[CALL_GRAPHQL_API]: {
			body: `mutation RootMutationType {
			    createPTOApplication(data:"${JSON.stringify(data).replace(/\"/gi, '\\"')}") {
			    	id,
			    	start_date,
			    	end_date,
			    	memo,
			    	hours,
			    	apply_date,
			    	applicant,
			    	status
			    }
			}`,
			types: [
			    actionTypes.CREATE_PTO_APPLICATION_REQUEST,
			    actionTypes.CREATE_PTO_APPLICATION_SUCCESS,
			    actionTypes.API_FAILURE
			],
			needAuthentication: true
		}
	};
};

export function removePTOApplication(id) {
	return {
		[CALL_GRAPHQL_API]: {
			body: `mutation RootMutationType {
			    deletePTOApplication(id:"${id}") {
			    	id,
			    	start_date,
			    	end_date,
			    	memo,
			    	hours,
			    	apply_date,
			    	applicant,
			    	status
			    }
			}`,
			types: [
			    actionTypes.DELETE_PTO_APPLICATION_REQUEST,
			    actionTypes.DELETE_PTO_APPLICATION_SUCCESS,
			    actionTypes.API_FAILURE
			],
			needAuthentication: true
		}
	};
};

export function setPTOApplicationStatus(id, status) {
	return {
		[CALL_GRAPHQL_API]: {
			body: `mutation RootMutationType {
			    updatePTOApplicationStatus(id:"${id}", status:"${status}") {
			    	id,
			    	start_date,
			    	end_date,
			    	memo,
			    	hours,
			    	apply_date,
			    	applicant,
			    	status
			    }
			}`,
			types: [
			    actionTypes.UPDATE_PTO_APPLICATION_REQUEST,
			    actionTypes.UPDATE_PTO_APPLICATION_SUCCESS,
			    actionTypes.API_FAILURE
			],
			needAuthentication: true
		}
	};
};