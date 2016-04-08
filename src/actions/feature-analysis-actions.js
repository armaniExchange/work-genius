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

export function setCurrentLeafNode(data) {
	return {
		type: actionTypes.SET_CURRENT_LEAF_NODE,
		data
	};
}

export function setCurrentTreeSelectedUser(id) {
	return {
		type: actionTypes.SET_CURRENT_TREE_SELECTED_USER,
		id
	};
}

export function setFormVisibility(status) {
	return {
		type: actionTypes.SET_FORM_VISIBILITY,
		status
	};
}

export function changeAssignmentCategoryUpdateMsgOpacity(opacity) {
  return {
    type: actionTypes.CHANGE_ASSIGNMENT_CATEGORY_UPDATE_MSG_OPACITY,
    opacity
  };
};

export function fetchOwnersSuccess(data) {
  return {
    type: actionTypes.FETCH_OWNERS_SUCCESS,
    data
  };
};

export function fetchOwners() {
  return (dispatch) => {
    let config = {
      method: 'POST',
      body: `{
          allUsers {
            id,
            nickname,
			name
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
        dispatch(fetchOwnersSuccess(body.data.allUsers));
      })
      .catch((err) => {
        dispatch(apiFailure(err));
      });
  };
};

export function fetchDifficultiesSuccess(data) {
  return {
    type: actionTypes.FETCH_DIFFICULTIES_SUCCESS,
    data
  };
};

export function fetchDifficulties() {
  return (dispatch) => {
    let config = {
      method: 'POST',
      body: `{
        allDifficulties{
          difficulty{
            id,
            title,
            color
          }
        }
      }`,
      headers: {
        'Content-Type': 'application/graphql',
        'x-access-token': localStorage.token
      }
    };
    dispatch(setLoadingState(true));
    return fetch(SERVER_API_URL, config)
      .then((res) => res.json())
      .then((body) => {
        dispatch(fetchDifficultiesSuccess(body.data.allDifficulties));
      })
      .catch((err) => {
        dispatch(apiFailure(err));
      });
  };
};

export function changeCategoryWaitForUpdate(field, value) {
  return {
    type: actionTypes.CHANGE_CATEGORY_WAIT_TO_UPDATE,
    field,
    value
  };
};

export function fetchAssignmentCategoriesSuccess(data) {
  return {
    type: actionTypes.FETCH_ASSIGNMENT_CATEGORIES_SUCCESS,
    data
  };
};

export function fetchAssignmentCategories(userId) {
	userId = userId ? userId : '';
	return (dispatch) => {
		let config = {
			method: 'POST',
			body: `{
			    allAssignmentCategories(userId:"${userId}") {
			    	id,
			        parentId,
					name,
					path,
					primary_owner,
					secondary_owner,
					difficulty {
			            id,
			            title,
			            color
			        }
			    }
			}`,
			headers: {
				'Content-Type': 'application/graphql',
				'x-access-token': localStorage.token
			}
		};
		dispatch(setLoadingState(true));
		return fetch(SERVER_API_URL, config)
			.then((res) => res.json())
			.then((body) => {
				if (!body.data.allAssignmentCategories) {
					throw new Error('Fetch Failed: empty data!');
				}
				dispatch(fetchAssignmentCategoriesSuccess(body.data.allAssignmentCategories));
				dispatch(setLoadingState(false));
			})
			.catch((err) => {
				dispatch(setLoadingState(false));
				dispatch(apiFailure(err));
			});
	};
};

export function fetchAnalysisPageData(currentUserId) {
    return (dispatch) => {
        dispatch(setLoadingState(true));
        Promise.all([
            dispatch(fetchAssignmentCategories(currentUserId)),
            dispatch(fetchOwners()),
            dispatch(fetchDifficulties())
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

export function updateOneAssignmentCategoryBase(dispatch, id, row, currentTreeSelectedUserId) {
  let config = {
    method: 'POST',
    body: `mutation RootMutationType {
        updateAssignmentCategory(data:"${JSON.stringify({...row, id}).replace(/\"/gi, '\\"')}")
    }`,
    headers: {
      'Content-Type': 'application/graphql',
      'x-access-token': localStorage.token
    }
  };
  return fetch(SERVER_API_URL, config)
    .then((res) => res.json())
    .then((body) => {
      console.log('body updateOneAssignmentCategoryBase', body);
      dispatch(setLoadingState(false));
      console.log('body.data updateOneAssignmentCategoryBase', body.data);
      /*changeAssignmentCategoryUpdateMsgOpacity(1);
      setTimeout(()=>{
        changeAssignmentCategoryUpdateMsgOpacity(0);
      }, 3000);*/
      dispatch(fetchAssignmentCategories(currentTreeSelectedUserId));
    })
    .catch((err) => {
      dispatch(setLoadingState(false));
      dispatch(apiFailure(err));
    });
};

export function updateOneAssignmentCategory(id, row, currentTreeSelectedUserId) {
  return (dispatch) => {
    updateOneAssignmentCategoryBase(dispatch, id, row, currentTreeSelectedUserId);
  };
};
