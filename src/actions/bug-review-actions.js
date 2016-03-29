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

export function fetchAllUsersSuccess(data){
    return {
        type: actionTypes.FETCH_BUG_REVIEW_ALL_USERS,
        data
    };
};

export function fetchPreventTagsOptionsSuccess(data){
    return {
        type: actionTypes.FETCH_BUG_REVIEW_PREVENT_TAGS_OPTIONS,
        data
    };
}

export function fetchCurrentProjectVersion(data){
    return {
        type: actionTypes.SET_BUG_REVIEW_PROJECT_VERSION,
        data
    };
}

export function fetchCurrentSelectUser(data){
    return {
        type: actionTypes.SET_BUG_REVIEW_SELECT_USER,
        data
    };
}
export function fetchBugReviewApplications() {
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
                    getAllBugs(label:"4.1.0",assignedTo:"yhou",pageSize:0,pageIndex:1){
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

export function fetchBugReviewChangeOptionsChangeSuccess(){
    return {
        type: actionTypes.FETCH_BUG_REVIEW_CHANGE_OPTIONS_SUCCESS
    };
};

let updateBug = (dispatch, data) => {
  data['id'] = parseInt(data['id']);

  let config = {
      method: 'POST',
      body: `mutation RootMutationType {
          updateBug(data:"${JSON.stringify(data).replace(/\"/gi, '\\"')}")
      }`,
      headers: {
        'Content-Type': 'application/graphql',
        'x-access-token': localStorage.token
      }
    };

  return fetch(SERVER_API_URL, config)
    .then((res) => res.json())
    .then(() => {
      dispatch(setLoadingState(false));
      dispatch(fetchBugReviewChangeOptionsChangeSuccess());
      dispatch(fetchBugReviewApplications());
    })
    .catch((err) => {
      dispatch(setLoadingState(false));
      dispatch(apiFailure(err));
    });
};

let createBugReviewTag = (tag) => {
  let data = {};
  data['tag_name'] = tag;

  let config = {
      method: 'POST',
      body: `mutation RootMutationType {
          createBugTag(data:"${JSON.stringify(data).replace(/\"/gi, '\\"')}")
      }`,
      headers: {
        'Content-Type': 'application/graphql',
        'x-access-token': localStorage.token
      }
    };

  return fetch(SERVER_API_URL, config)
    .then((res) => {
      res.json();
    })
    .then(() => {
    })
    .catch(() => {
    });
};

export function resolvedReasonTypeChange(review, reasonType){
  review['resolved_type'] = reasonType;

  return (dispatch) => {
    updateBug(dispatch, review);
  };
};

export function changeReviewTagOptions(review, reviewTagList){
  reviewTagList.map((tag) => {
    createBugReviewTag(tag);
  });
  review['tags'] = reviewTagList;

  return (dispatch) => {
    updateBug(dispatch, review);
  };
};

export function changeMenuTagOptions(review, menuTag){
  review['menu'] = menuTag;

  return (dispatch) => {
    updateBug(dispatch, review);
  };
};

export function changeReviewText(review, reviewText){
  review['review'] = reviewText;

  return (dispatch) => {
    updateBug(dispatch, review);
  };
};

export function fetchBugReviewApplications(version, userAlisa) {
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
                    getAllBugs(label:"` + version + `",assignedTo:"` + userAlisa.toLowerCase() + `",pageSize:0,pageIndex:1){
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
                dispatch(fetchCurrentProjectVersion(version));
                dispatch(fetchCurrentSelectUser(userAlisa));
                dispatch(fetchBugReviewApplicationsSuccess(body.data.getAllBugs));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
};

export function fetchPreventTagsOptionRequest() {
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
                    getAllBugTags(name: ""){
                      id,
                      tag_name
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
                dispatch(fetchPreventTagsOptionsSuccess(body.data.getAllBugTags));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
}

export function fetchPreventTagsOptions(){
    return (dispatch) => {
      Promise.all(
          [dispatch(fetchPreventTagsOptionRequest())]
      ).then(
            () => {
                dispatch(setLoadingState(false));
            },
            (err) => {
                dispatch(setLoadingState(false));
                dispatch(apiFailure(err));
            }
        );
    };
}

export function fetchAllUsersRequest(){
  return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
                    allUsers{
                        id,
                        email,
                        name,
                        nickname,
                        alias
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
                dispatch(fetchAllUsersSuccess(body.data.allUsers));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
}

export function fetchAllUsers(){
    return (dispatch) => {
      Promise.all(
          [dispatch(fetchAllUsersRequest())]
      ).then(
            () => {
                dispatch(setLoadingState(false));
            },
            (err) => {
                dispatch(setLoadingState(false));
                dispatch(apiFailure(err));
            }
        );
    };
}

export function fetchBugReviewPageData(version, userAlisa) {
    version = version ? version : '4.1.0';
    return (dispatch, getState) => {
        userAlisa = userAlisa ? userAlisa : getState().app.toJS().currentUser.email.split('@')[0];
        dispatch(setLoadingState(true));
        Promise.all([
            dispatch(fetchBugReviewApplications(version, userAlisa))
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

