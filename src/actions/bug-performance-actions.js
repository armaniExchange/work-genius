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



export function fetechBugReportIntroducedSuccess(data) {
  return {
    type: actionTypes.FETCH_BUG_REPORT_INTRODUCED_SUCCESS,
    data
  };
}


export function fetchStateRelease(data) {
    return {
        type: actionTypes.FETCH_BUG_REPORT_RELEASE,
        data
    };
}

export function changeCurrentProjectVersion(data){
    return {
        type: actionTypes.SET_BUG_REPORT_PROJECT_VERSION,
        data
    };
}

export function fetchModuleBugsStatsSuccess(data){
    return {
        type: actionTypes.FETCH_MODULE_BUGS_STATS_SUCCESS,
        data
    };
}


export function fetchBugReportIntroduced(version) {
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
                getBugPerformance(label:"`+ version +`"){
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
                dispatch(fetechBugReportIntroducedSuccess(body.data.getBugPerformance));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
};

export function fetchModuleBugsStats(version) {
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
                getModuleBugs(label:"`+ version +`"){
                    name,
                    item1
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
                dispatch(fetchModuleBugsStatsSuccess(body.data.getModuleBugs));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
};

export function fetchBugPerformancePageData(version) {
    version = version ? version : '4.1.0';
    return (dispatch, getState) => {
        dispatch(setLoadingState(true));
        Promise.all([
            dispatch(fetchCurrentUser(getState().app.toJS().currentUser)),
            dispatch(fetchReleaseList(fetchStateRelease)),
            dispatch(fetchBugReportIntroduced(version)),
            dispatch(fetchModuleBugsStats(version))
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
