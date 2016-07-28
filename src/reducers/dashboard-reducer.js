import actionTypes from '../constants/action-types';
import Immutable, { List, Map } from 'immutable';

const initialState = Map({
  counter: 0,
  isLoading: false,
  releases: List.of()
});

function fetchUpdateRelease(state, release) {
  let releases = state.get('releases').toJS();
  let old = releases.find((one, index) => {
    one.index = index;
    return one.name === release.name;
  });

  if (old) {
    if (release.delete) {
      releases.splice(old.index, 1);
    } else {
      old.name = release.name;
      old.date = release.date;
      old.priority = release.priority;
    }
  } else {
    releases.unshift(release);
  }

  return state.set('releases', Immutable.fromJS(releases));
}

export default function dashboardReducer(state = initialState, action) {
  let nextState = state;
  switch (action.type) {
    case actionTypes.FETCH_RELEASE_LIST_SUCCESS:
      nextState = nextState.set('releases', Immutable.fromJS(action.data));
      return nextState;
    case actionTypes.FETCH_RELEASE_UPDATE_SUCCESS:
      nextState = fetchUpdateRelease(nextState, action.data);
      return nextState;
    default:
      return nextState;
  }
};
