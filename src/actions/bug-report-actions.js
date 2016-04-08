// Constants
import actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';
// Actions
import {
    setLoadingState,
    apiFailure
} from './app-actions';

export function fetchBugReportRootCauseSuccess(data){
    return {
        type: actionTypes.FETCH_BUG_REPORT_ROOT_CAUSE_SUCCESS,
        data
    };
};

export function fetchBugReportTagsSuccess(data){
    return {
        type: actionTypes.FETCH_BUG_REPORT_TAGS_SUCCESS,
        data
    };
};

export function fetchBugReportOwnerTotalSuccess(data){
    return {
        type: actionTypes.FETCH_BUG_REPORT_OWNER_TOTAL_SUCCESS,
        data
    };
};

export function fetchBugReportOwnerSuccess(data){
    return {
        type: actionTypes.FETCH_BUG_REPORT_OWNER_SUCCESS,
        data
    };
};

export function fetchCurrentProjectVersion(data){
    return {
        type: actionTypes.SET_BUG_REPORT_PROJECT_VERSION,
        data
    };
}

export function fetchBugReportRootCause(version) {
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
              getRootCauseSummary(label:"` + version + `"){
                name,
                number,
                percentage
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
                dispatch(fetchCurrentProjectVersion(version));
                dispatch(fetchBugReportRootCauseSuccess(body.data.getRootCauseSummary));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
};

export function fetchBugReportTags(version) {
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
              getTagSummary(label:"` + version + `"){
                name,
                number,
                percentage
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
                dispatch(fetchCurrentProjectVersion(version));
                dispatch(fetchBugReportTagsSuccess(body.data.getTagSummary));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
};

export function fetchBugReportOwner(version) {
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
              getOwnerRootCauseSummary(label:"` + version + `"){
                name,
                item1,
                item2,
                item3,
                item4,
                item5,
                item6
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
                dispatch(fetchCurrentProjectVersion(version));
                dispatch(fetchBugReportOwnerSuccess(body.data.getOwnerRootCauseSummary));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
};

export function fetchBugReportOwnerTotal(version) {
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
              getOwnerSummary(label:"` + version + `"){
                name,
                number,
                percentage
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
                dispatch(fetchBugReportOwnerTotalSuccess(body.data.getOwnerSummary));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
};

export function fetchBugReportPageData(version) {
    version = version ? version : '4.1.0';
    return (dispatch) => {
        dispatch(setLoadingState(true));
        Promise.all([
            dispatch(fetchBugReportRootCause(version)),
            dispatch(fetchBugReportTags(version)),
            dispatch(fetchBugReportOwner(version)),
            dispatch(fetchBugReportOwnerTotal(version))
        ]).then(
            () => {
                dispatch(setLoadingState(false));
            },
            (err) => {
                dispatch(setLoadingState(false));
                dispatch(apiFailure(err));
            }
        );
    };
};

