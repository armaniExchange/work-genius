import { Map } from 'immutable';

import actionTypes from '../constants/action-types';

const initialState = Map({
  pager: Map({ totalRow: 0, pageRow: 25, rowIndex: 1, pageSize: 0 }),
  checkPoints: [],
  checkPointsObj: {},
  weeklyBugReport: {
    summary: '',
    bugs: {}
  }
});

export default function bugReviewReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCH_BUG_WEEKLY_REPORT: {
      return state.set('weeklyBugReport', action.payload);
    }
    case actionTypes.SET_BUG_CHECKPOINT: {
      if (action.payload.bugWeeklyReport) {
        state = state.set('weeklyBugReport', action.payload.bugWeeklyReport);
      }
      
      const payload = action.payload.res;
      state = state.set('checkPoints', payload.treedata);
      const checkPointsObj = {};
      payload.checkpoints.forEach(function(item) {
        checkPointsObj[item.id] = item;
      });
      return state.set('checkPointsObj', checkPointsObj);
    }
    case actionTypes.UPDATE_BUG_REPORT: {
      const {
        payload: { key, options }
      } = action;
      const bugReport = state.get('weeklyBugReport');
      bugReport.bugs[key] = {
        ...bugReport.bugs[key],
        ...options
      };
      return state.set('weeklyBugReport', {...bugReport});
    }
    case actionTypes.SET_WEEKLY_SUMMARY: {
      const {
        payload: { content }
      } = action;
      const bugReport = state.get('weeklyBugReport');
      return state.set('weeklyBugReport', {
        ...bugReport,
        summary: content
      });
    }
    default:
      return state;
  }
}
