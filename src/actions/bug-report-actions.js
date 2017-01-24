// Constants
import actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';
// Actions
import {
    setLoadingState,
    apiFailure
} from './app-actions';
import { fetchReleaseList } from './dashboard-page-actions';

export function fetchCurrentUser(data) {
    return {
        type: actionTypes.FETCH_BUG_REPORT_CURRENT_USER,
        data
    };
}

export function fetchBugReportRootCauseSuccess(data){
    return {
        type: actionTypes.FETCH_BUG_REPORT_ROOT_CAUSE_SUCCESS,
        data
    };
};

export function fetechBugReportIntroducedSuccess(data) {
  return {
    type: actionTypes.FETCH_BUG_REPORT_INTRODUCED_SUCCESS,
    data
  };
}

export function fetchBugReportTagsSuccess(data){
    return {
        type: actionTypes.FETCH_BUG_REPORT_TAGS_SUCCESS,
        data
    };
};

export function fetchBugReportRCASuccess(data) {
  return {
      type: actionTypes.FETCH_BUG_RCA_SUCCESS,
      data
  };
}

export function fetchBugReportRCAUpdateSuccess(data) {
  return {
      type: actionTypes.FETCH_BUG_RCA_UPDATE_SUCCESS,
      data
  };
}

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

export function fetchStateRelease(data) {
    return {
        type: actionTypes.FETCH_BUG_REPORT_RELEASE,
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

export function fetchBugRCA() {
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
              getRCABugCount(year:2016){
                  employee_id,
                  employee_name,
                  year,
                  bug_count
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
                console.log(body.data.getRCABugCount);
                dispatch(fetchBugReportRCASuccess(body.data.getRCABugCount));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
};

export function fetchBugRCAUpdate(counter) {
    return () => {
        let data = {
          employee_id: counter.employee_id,
          employee_name: counter.employee_name,
          year: 2016,
          bug_count: counter.bug_count
        };
        let config = {
            method: 'POST',
            body: `
              mutation RootMutationType {
                updateRCABugCount(data:"${JSON.stringify(data).replace(/\\/gi, '\\\\').replace(/\"/gi, '\\"')}")
              }
            `,
            headers: {
                'Content-Type': 'application/graphql',
                'x-access-token': localStorage.token
            }
        };

        return fetch(SERVER_API_URL, config)
            .then((res) => res.json())
            .then(() => {})
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


export function fetchBugReportIntroduced() {
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
                getBugPerformance{
                    name,
                    item1,
                    item2,
                    item3,
                    item4,
                    item5,
                    seniority,
                    score
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
                console.log(body.data);
                dispatch(fetechBugReportIntroducedSuccess(body.data.getBugPerformance));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
};

export function fetchBugReportPageData(version) {
    version = version ? version : '4.1.0';
    return (dispatch, getState) => {
        dispatch(setLoadingState(true));
        Promise.all([
            dispatch(fetchCurrentUser(getState().app.toJS().currentUser)),
            dispatch(fetchBugRCA()),
            dispatch(fetchBugReportRootCause(version)),
            dispatch(fetchBugReportTags(version)),
            dispatch(fetchBugReportOwner(version)),
            dispatch(fetchBugReportOwnerTotal(version)),
            dispatch(fetchReleaseList(fetchStateRelease)),
            dispatch(fetchBugReportIntroduced())
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
