/**
 * @author Howard Chang
 */
// Libraries
// import fetch from 'isomorphic-fetch';
// Constants
import actionTypes from '../constants/action-types';
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

export function fetchBugReviewQueryData(data, version, user, menu, tag, cause, pager) {
    return {
        type: actionTypes.FETCH_BUG_REVIEW_QUERY_DATA,
        data,
        version,
        user,
        menu,
        tag,
        cause,
        pager
    };
}

export function fetchBugReviewChangeOptionsChangeSuccess(data){
    return {
        type: actionTypes.FETCH_BUG_REVIEW_CHANGE_OPTIONS_SUCCESS,
        data
    };
};

export function fetchBugReviewAddOptionsChangeSuccess(data){
    return {
        type: actionTypes.FETCH_BUG_REVIEW_ADD_OPTIONS_SUCCESS,
        data
    };
}

let updateBug = (dispatch, data) => {
  data['id'] = parseInt(data['id']);

  let config = {
      method: 'POST',
      body: `mutation RootMutationType {
          updateBug(data:"${JSON.stringify(data).replace(/\\/gi, '\\\\').replace(/\"/gi, '\\"')}")
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
      dispatch(fetchBugReviewChangeOptionsChangeSuccess(data));
      // dispatch(fetchBugReviewApplications());
    })
    .catch((err) => {
      dispatch(setLoadingState(false));
      dispatch(apiFailure(err));
    });
};

function createBugReviewTag(tag) {
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

  return (dispatch) => {
    fetch(SERVER_API_URL, config)
        .then((res) => {
          res.json();
          dispatch(fetchBugReviewAddOptionsChangeSuccess(tag));
        })
        .then(() => {
        })
        .catch(() => {
        });
    };
};

function changeOptionsReviewTags(dispatch, optionsReviewTags, tagList){

    tagList.forEach((tag) => {
        let notIn = true;
        optionsReviewTags.forEach((option) => {
            if (option.value === tag){
                notIn = false;
            }
        });
        if (notIn) {
            dispatch(createBugReviewTag(tag));
        }
    });

}

export function resolvedReasonTypeChange(review, reasonType){
  review['resolved_type'] = reasonType;

  return (dispatch) => {
    updateBug(dispatch, review);
  };
};

export function changeReviewTagOptions(review, reviewTagList){
  // reviewTagList.map((tag) => {
  //   createBugReviewTag(tag);
  // });

  review['tags'] = reviewTagList;

  return (dispatch, getState) => {
    var optionsReviewTags = getState().bugReview.toJS().optionsReviewTags;
    changeOptionsReviewTags(dispatch, optionsReviewTags, reviewTagList);
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

export function fetchBugReviewApplications(pager, version, userAlisa, menu, rootCause, preventTag) {
    return (dispatch) => {
        var user = '';
        if (userAlisa !== 'All') {
            user = userAlisa ? userAlisa.toLowerCase() : userAlisa;
        }
        menu = menu ? menu : '';
        rootCause = rootCause ? rootCause : '';
        preventTag = preventTag ? preventTag: '';
        let pageRow = pager['pageRow'];
        let rowIndex = pager['rowIndex'];
        let config = {
            method: 'POST',
            body: `{
                    getAllBugs(label:"` + version + `",assignedTo:"` + user +
                        `",menu:"` + menu +
                        `",rootCause:"`+ rootCause +
                        `",preventTag:"` + preventTag +
                        `",pageSize:` + pageRow +
                        `,pageIndex:` + rowIndex +
                        `){

                        id,
                        assigned_to,
                        bug_severity,
                        bug_status,
                        label,
                        menu,
                        resolved_type,
                        review,
                        tags,
                        title,
                        resolution,
                        total_row
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
                dispatch(fetchBugReviewQueryData(
                    body.data.getAllBugs,
                    version,
                    userAlisa,
                    menu,
                    preventTag,
                    rootCause,
                    pager
                ));
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

export function fetchBugReviewPageData(pager, version, userAlisa, menu, rootCause, preventTag) {
    version = version ? version : '4.1.0';
    return (dispatch, getState) => {
        userAlisa = userAlisa ? userAlisa : getState().app.toJS().currentUser.email.split('@')[0];
        dispatch(setLoadingState(true));
        Promise.all([
            dispatch(fetchBugReviewApplications(pager, version, userAlisa, menu, rootCause, preventTag))
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

