/**
 * @author Howard Chang
 */
// Libraries
import fetch from 'isomorphic-fetch';
// Constants
import * as actionTypes from '../constants/action-types';
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

export function setFormVisibility(status) {
	return {
		type: actionTypes.SET_FORM_VISIBILITY,
		status
	};
}
export function updateOneAssignmentCategoryBase(dispatch, row) {
  let config = {
    method: 'POST',
    body: `mutation RootMutationType {
        updateAssignmentCategory(data:"${JSON.stringify(row).replace(/\"/gi, '\\"')}")
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
      //TODO: dispatch success action here!
    })
    .catch((err) => {
      dispatch(setLoadingState(false));
      dispatch(apiFailure(err));
    });
};

export function updateOneAssignmentCategory(row) {
  return (dispatch) => {
    updateOneAssignmentCategoryBase(dispatch, row);
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
            nickname
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
        dispatch(setLoadingState(false));
        dispatch(fetchOwnersSuccess(body.data.allUsers));
      })
      .catch((err) => {
        dispatch(setLoadingState(false));
        dispatch(apiFailure(err));
      });
  };
};

export function fetchAssignmentCategoriesSuccess(data) {
  return {
    type: actionTypes.FETCH_ASSIGNMENT_CATEGORIES_SUCCESS,
    data
  };
}

export function fetchAssignmentCategories() {
	return (dispatch) => {
		let config = {
			method: 'POST',
			body: `{
			    allAssignmentCategories {
			    	id,
			        parentId,
					name,
					path,
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
				dispatch(setLoadingState(false));
				dispatch(fetchAssignmentCategoriesSuccess(body.data.allAssignmentCategories));
			})
			.catch((err) => {
				dispatch(setLoadingState(false));
				dispatch(apiFailure(err));
			});
	};
};
