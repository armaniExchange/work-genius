/**
 * @author Howard Chang
 */
// Libraries
import fetch from 'isomorphic-fetch';
// Constants
import actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';
// Actions
import {
    setLoadingState,
    apiFailure
} from './app-actions';
import { setCurrentSelectedUserId } from './main-actions';

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

export function fetchUsersWithPTOSuccess(data) {
    return {
        type: actionTypes.FETCH_USERS_WITH_PTO_SUCCESS,
        data
    };
};

export function setApplicantToFilter(applicant) {
    return {
        type: actionTypes.SET_APPLICANT_NAME_TO_FILTER,
        applicant
    };
};

export function resetPTOTable() {
    return {
        type: actionTypes.RESET_PTO_TABLE
    };
};

export function decreaseYearRange() {
    return {
        type: actionTypes.DECREASE_YEAR
    };
};

export function increaseYearRange() {
    return {
        type: actionTypes.INCREASE_YEAR
    };
};

export function fetchPTOApplications(userId, timeRange) {
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
                ptoApplications(applicantId: "${userId}", timeRange: ${timeRange}) {
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
        return fetch(SERVER_API_URL, config)
            .then((res) => res.json())
            .then((body) => {
                dispatch(fetchPTOApplicationsSuccess(body.data.ptoApplications));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
};

export function fetchUsersWithPTO() {
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
                allUserWithPto {
                    id,
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
        return fetch(SERVER_API_URL, config)
            .then((res) => res.json())
            .then((body) => {
                dispatch(fetchUsersWithPTOSuccess(body.data.allUserWithPto));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
};

export function fetchPTOPageData(userId) {
    return (dispatch, getState) => {
        let timeRange = getState().pto.toJS().selectedYear;
        dispatch(setLoadingState(true));
        Promise.all([
            dispatch(fetchUsersWithPTO()),
            dispatch(fetchPTOApplications(userId, timeRange))
        ]).then(
            () => {
                dispatch(setCurrentSelectedUserId(userId));
                dispatch(setLoadingState(false));
            },
            (err) => {
                dispatch(setLoadingState(false));
                dispatch(apiFailure(err));
            }
        );
    };
};

export function goToPreviousYear() {
    return (dispatch, getState) => {
        let currentSelectedUserID = getState().pto.toJS().currentSelectedUserID;
        dispatch(decreaseYearRange());
        dispatch(fetchPTOPageData(currentSelectedUserID));
    };
};

export function goToNextYear() {
    return (dispatch, getState) => {
        let currentSelectedUserID = getState().pto.toJS().currentSelectedUserID;
        dispatch(increaseYearRange());
        dispatch(fetchPTOPageData(currentSelectedUserID));
    };
};

export function createPTOApplication(data) {
    return (dispatch, getState) => {
        let config = {
                method: 'POST',
                body: `mutation RootMutationType {
                    createPTOApplication(data:"${JSON.stringify(data).replace(/\"/gi, '\\"')}")
                }`,
                headers: {
                    'Content-Type': 'application/graphql',
                    'x-access-token': localStorage.token
                }
            },
            currentSelectedUserID = getState().pto.toJS().currentSelectedUserID;

        dispatch(setPTOApplyModalState(false));
        dispatch(setLoadingState(true));
        return fetch(SERVER_API_URL, config)
            .then((res) => res.json())
            .then(() => {
                dispatch(setLoadingState(false));
                dispatch(fetchPTOPageData(currentSelectedUserID));
            })
            .catch((err) => {
                dispatch(setLoadingState(false));
                dispatch(apiFailure(err));
            });
    };
};

export function removePTOApplication(id) {
    return (dispatch, getState) => {
        let config = {
                method: 'POST',
                body: `mutation RootMutationType {
                    deletePTOApplication(id:"${id}")
                }`,
                headers: {
                    'Content-Type': 'application/graphql',
                    'x-access-token': localStorage.token
                }
            },
            currentSelectedUserID = getState().pto.toJS().currentSelectedUserID;

        dispatch(setLoadingState(true));
        return fetch(SERVER_API_URL, config)
            .then((res) => res.json())
            .then(() => {
                dispatch(setLoadingState(false));
                dispatch(fetchPTOPageData(currentSelectedUserID));
            })
            .catch((err) => {
                dispatch(setLoadingState(false));
                dispatch(apiFailure(err));
            });
    };
};

export function setPTOApplicationStatus(id, status) {
    return (dispatch, getState) => {
        let config = {
                method: 'POST',
                body: `mutation RootMutationType {
                    updatePTOApplicationStatus(id:"${id}", status:"${status}")
                }`,
                headers: {
                    'Content-Type': 'application/graphql',
                    'x-access-token': localStorage.token
                }
            },
            currentSelectedUserID = getState().pto.toJS().currentSelectedUserID;

        dispatch(setLoadingState(true));
        return fetch(SERVER_API_URL, config)
            .then((res) => res.json())
            .then(() => {
                dispatch(setLoadingState(false));
                dispatch(fetchPTOPageData(currentSelectedUserID));
            })
            .catch((err) => {
                dispatch(setLoadingState(false));
                dispatch(apiFailure(err));
            });
    };
};