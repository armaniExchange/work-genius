/**
 * @author Yushan Hou
 */
// Libraries
import fetch from 'isomorphic-fetch';
// Constants
import actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';

const fetchState = {
  releaseList: (data) => {
    return {
      type: actionTypes.FETCH_RELEASE_LIST_SUCCESS,
      data
    };
  },
  releaseUpdate: (data) => {
    return {
      type: actionTypes.FETCH_RELEASE_UPDATE_SUCCESS,
      data
    };
  }
};

const releaseActions = {

  list: (callback) => {
    return (dispatch) => {
      let name = '';
      let config = {
          method: 'POST',
          body: `{
              getReleaseList(name: "${name}") {
                  id,
                  name,
                  date,
                  priority
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
            dispatch(callback(body.data.getReleaseList));
            // dispatch(fetchState.releaseList(body.data.getReleaseList));
          })
          .catch((err) => {
            throw new Error(err);
          });
    };
  },

  modify: (item) => {
    return (dispatch) => {
      // var data = item.data;
      let config = {
          method: 'POST',
          body: `mutation RootMutationType {
              modifyRelease(data:"${JSON.stringify(item).replace(/\"/gi, '\\"')}")
          }`,
          headers: {
              'Content-Type': 'application/graphql',
              'x-access-token': localStorage.token
          }
      };

      return fetch(SERVER_API_URL, config)
          .then((res) => res.json())
          .then((body) => {
            if (body && body.data && body.data.modifyRelease) {
              dispatch(fetchState.releaseUpdate(item));
            }
          })
          .catch((err) => {
            throw new Error(err);
          });
    };
  },
  delete: (item) => {
    item.delete = true;
    return (dispatch) => {
      // var data = item.data;
      let config = {
          method: 'POST',
          body: `mutation RootMutationType {
              deleteRelease(name:"${item.name}")
          }`,
          headers: {
              'Content-Type': 'application/graphql',
              'x-access-token': localStorage.token
          }
      };
      return fetch(SERVER_API_URL, config)
          .then((res) => res.json())
          .then((body) => {
            if (body && body.data && body.data) {
              dispatch(fetchState.releaseUpdate(item));
            }
          })
          .catch((err) => {
            throw new Error(err);
          });
    };
  }
};

export function fetchReleaseList(callback) {
  return dispatch => {
    dispatch(releaseActions.list(callback));
  };
}

export function releaseList() {
  return dispatch => {
    dispatch(fetchReleaseList(fetchState.releaseList));
    // dispatch(releaseActions.list());
  };
}

export function addRelease(item) {
  return (dispatch) => {
    dispatch(releaseActions.modify(item));
  };
}

export function deleteRelease(item) {
  return dispatch => {
    dispatch(releaseActions.delete(item));
  };
}
