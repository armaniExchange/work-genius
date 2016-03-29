/**
 * @author Howard Chang
 */
// Libraries
// import fetch from 'isomorphic-fetch';
// Constants
import * as actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';
// Actions
import {
    setLoadingState,
    apiFailure
} from './app-actions';
//import { setCurrentSelectedUserId } from './main-actions';

export function fetchBugReviewApplicationsSuccess(data){
    return {
        type: actionTypes.FETCH_BUG_REVIEW_APPLICATION_SUCCESS,
        data
    };
};

export function resolvedReasonTypeChange(review, reasonType){
    console.log('==========> Bug Review Action: Resolved Reason Type Change;');
    console.log(review, reasonType);
    return {
        type: actionTypes.FETCH_BUG_REVIEW_CHANGE_RESOLVE_REASON_TYPE
    };
}

export function fetchBugReviewApplications() {
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
                    getAllBugs(label:"4.1.0",assignedTo:"yhou",pageSize:25,pageIndex:1){
                        id,
                        assigned_to,
                        bug_severity,
                        bug_status,
                        label,
                        menu,
                        resolved_type,
                        review,
                        tags,
                        title
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
                dispatch(fetchBugReviewApplicationsSuccess(body.data.getAllBugs));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
};

// const tmpData = [
//     {
//         'bug_id': '332472',
//         'title': 'Need support license',
//         'resovled_reason_type': '',
//         'review_tags': '',
//         'menu_tag': '',
//         'owner': '',
//         'review': ''
//     },
//     {
//         'bug_id': '332473',
//         'title': 'Status show tip',
//         'resovled_reason_type': '',
//         'review_tags': '',
//         'menu_tag': '',
//         'owner': '',
//         'review': ''
//     },
//     {
//         'bug_id': '330002',
//         'title': 'page not found',
//         'resovled_reason_type': '',
//         'review_tags': '',
//         'menu_tag': '',
//         'owner': '',
//         'review': ''
//     },
//     {
//         'bug_id': '33s472',
//         'title': 'message error',
//         'resovled_reason_type': '',
//         'review_tags': '',
//         'menu_tag': '',
//         'owner': '',
//         'review': ''
//     }
// ];

export function fetchBugReviewPageData() {
    return (dispatch) => {
        dispatch(setLoadingState(true));
        Promise.all([
            dispatch(fetchBugReviewApplications())
        ]).then(
            () => {
                dispatch(setLoadingState(false));
            },
            (err) => {
                dispatch(setLoadingState(false));
                dispatch(apiFailure(err));
            }
        );
        // dispatch(fetchBugReviewApplicationsSuccess(tmpData));
    };
};

