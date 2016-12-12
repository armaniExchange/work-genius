// Libraries
import fetch from 'isomorphic-fetch';
// Constants
import actionTypes from '../constants/action-types';
import { SERVER_API_URL, SERVER_LOGIN_URL } from '../constants/config';

export function setLoadingState(state) {
  return {
    type: actionTypes.SET_LOADING_STATE,
    state
  };
};

export function apiFailure(err) {
  let msg = err.message ? err.message :
    err.stack ? err.stack : err;
  return (dispatch) => {
    dispatch(setLoadingState(false));
    dispatch({
      type: actionTypes.API_FAILURE,
      err : msg
    });
  };
};

export function clearErrorMessage() {
  return {
    type: actionTypes.CLEAR_ERROR_MESSAGE
  };
};

export function loginFailure(error) {
  return {
    type: actionTypes.LOGIN_FAILURE,
    error
  };
}

export function loginSuccess(token, user, isAuthenticated) {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    token,
    user,
    isAuthenticated
  };
}

export function getCurrentUserSuccess(token, user, isAuthenticated) {
  return {
    type: actionTypes.GET_CURRENT_USER_SUCCESS,
    token,
    user,
    isAuthenticated
  };
}

export function logout() {
  return {
    type: actionTypes.LOG_OUT
  };
};

export function login(user) {
  return (dispatch) => {
    let config = {
      method: 'POST',
      body: `{
        "account": "${user.username}",
        "password": "${user.password}"
      }`,
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.token
      }
    };
    dispatch(setLoadingState(true));
    return fetch(SERVER_LOGIN_URL, config)
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        dispatch(setLoadingState(false));
        if (body.success) {
          dispatch(loginSuccess(body.token, body.user, true));
        } else {
          dispatch(loginFailure(body.message));
        }
      })
      .catch((err) => {
        dispatch(setLoadingState(false));
        dispatch(loginFailure(err.message));
      });
  };
};

export function getCurrentUser() {
  return (dispatch) => {
    let config = {
      method: 'POST',
      body: `{
          currentUser {
            id,
            name,
            email,
            nickname,
            token,
            privilege
          }
      }`,
      headers: {
        'Content-Type': 'application/graphql',
        'x-access-token': localStorage.token
      }
    };
    return fetch(SERVER_API_URL, config)
      .then((res) => {
        if (res.status >= 400) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((body) => {
        dispatch(getCurrentUserSuccess(body.data.currentUser.token, body.data.currentUser, true));
      })
      .catch(() => {
        dispatch(loginFailure(''));
      });
  };
};



export function sendMail(to, cc, bcc, subject, text, html, includeManagers = false) {
    return (dispatch) => {
    let query = `${to ? 'to:[' + to.map(n => '\"' + n + '\"').join(',') + '],' : ''}${cc ? 'cc:[' + cc.map(n => '\"' + n + '\"').join(',') + '],' : ''}${bcc ? 'bcc:[' + bcc.map(n => '\"' + n + '\"').join(',') + '],' : ''}${subject ? 'subject:"' + subject + '",' : ''}${text ? 'text:"' + text + '",' : ''}${html ? 'html:"' + html + '",' : ''}`;
        let config = includeManagers ?
        {
        method: 'POST',
                body: `mutation RootMutationType {
                    sendMailIncludingManagers(${query.slice(0, -1)})
                }`,
                headers: {
                    'Content-Type': 'application/graphql',
                    'x-access-token': localStorage.token
                }
      }
      :
      {
                method: 'POST',
                body: `mutation RootMutationType {
                    sendMail(${query.slice(0, -1)})
                }`,
                headers: {
                    'Content-Type': 'application/graphql',
                    'x-access-token': localStorage.token
                }
            };

        return fetch(SERVER_API_URL, config)
            .then((res) => res.json())
            .then(() => {})
            .catch((err) => {
                dispatch(apiFailure(err));
            });
    };
};
