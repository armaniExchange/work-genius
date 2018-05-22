
import { SERVER_BASIC_URL } from '../constants/config';
import actionTypes from '../constants/action-types';
import { apiFailure } from './app-actions';

export function fetchCheckpoint() {
  return (dispatch) => {
    return fetch(SERVER_BASIC_URL + 'bug_weekly_report/checkpoint', {
      method: 'GET',
      headers: {
        'x-access-token': localStorage.token
      }
    })
    .then(res => {
      if (res.status >= 400) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((res) => {
      dispatch({
        type: actionTypes.SET_BUG_CHECKPOINT,
        payload: { res }
      });
    })
    .catch((err) => {
      dispatch(apiFailure(err));
    });
  };
}

export function fetchWeeklyReport(user, account, date) {
  return (dispatch) => {
    return fetch(`${SERVER_BASIC_URL}bug_weekly_report/?user=${user}&date=${date}&account=${account}`, {
      method: 'GET',
      headers: {
        'x-access-token': localStorage.token
      }
    })
    .then(res => {
      if (res.status >= 400) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((res) => {
      dispatch({
        type: actionTypes.FETCH_BUG_WEEKLY_REPORT,
        payload: res
      });
    })
    .catch((err) => {
      dispatch(apiFailure(err));
    });
  };
}

export function updateBugReport(key, options) {
  return {
    type: actionTypes.UPDATE_BUG_REPORT,
    payload: { key, options }
  };
}

export function updateSummary(content) {
  return {
    type: actionTypes.SET_WEEKLY_SUMMARY,
    payload: { content }
  };
}

export function saveBugReport(user, account, date, report, callback) {
  return (dispatch) => {
    var data = [
      `user=${user}`,
      `account=${account}`,
      `date=${date}`,
      `report=${JSON.stringify(report)}`
    ];
    return fetch(`${SERVER_BASIC_URL}bug_weekly_report`, {
      method: 'POST',
      headers: {
        'x-access-token': localStorage.token,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: data.join('&')
    })
    .then(res => {
      if (res.status >= 400) {
        throw new Error(res.statusText);
      }
      callback && callback();
      return res.json();
    })
    .then(res => {
      const { weeklyReport, checkpoint } = res;
      dispatch({
        type: actionTypes.SET_BUG_CHECKPOINT,
        payload: {
          res: checkpoint, 
          bugWeeklyReport: weeklyReport 
        }
      });
    })
    .catch((err) => {
      dispatch(apiFailure(err));
    });
  };
}

export function removeCheckpoint(checkpointId) {
  return (dispatch, getState) => {
    return fetch(`${SERVER_BASIC_URL}bug_weekly_report/checkpoint?id=${checkpointId}`, {
      method: 'DELETE',
      headers: {
        'x-access-token': localStorage.token,
        'Accept': 'application/json',
      }
    })
    .then(res => {
      if (res.status >= 400) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then(res => {
      const bugWeeklyReport = getState().bugWeeklyReport.get('weeklyBugReport');
      for (const key in bugWeeklyReport.bugs) {
        if (!bugWeeklyReport.bugs.hasOwnProperty(key)) {
          continue;
        }

        const bug = bugWeeklyReport.bugs[key];
        if (bug.checkpoint && bug.checkpoint === checkpointId) {
          delete bug.checkpoint;
        }
      }
      dispatch({
        type: actionTypes.SET_BUG_CHECKPOINT,
        payload: { res, bugWeeklyReport }
      });
    });
  };
}

export function approvalCheckpoint(checkpointId) {
  return (dispatch) => {
    return fetch(`${SERVER_BASIC_URL}bug_weekly_report/checkpoint?id=${checkpointId}`, {
      method: 'PUT',
      headers: {
        'x-access-token': localStorage.token,
        'Accept': 'application/json',
      }
    })
    .then(res => {
      if (res.status >= 400) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then(res => {
      dispatch({
        type: actionTypes.SET_BUG_CHECKPOINT,
        payload: { res }
      });
    });
  };
}
