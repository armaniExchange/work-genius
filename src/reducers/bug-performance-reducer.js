// Libraries
import Immutable, { Map, List, OrderedMap} from 'immutable';
// Constants
import actionTypes from '../constants/action-types';

const initialState = Map({
    currentUser: Map(),
    introducedTableData: List.of(),
    allProjectVersions: List.of(),
    currentProjectVersion: '4.1.1,4.1.1-p1,4.1.1-p2,4.1.0-p4,4.1.0-p5,4.1.0-p6,4.1.0-p7,4.1.0-p8,4.1.0 2016',
    introducedTableTitleKeyMap: List.of(
        Map({ title: 'Fixer', key: 'name', colspan: 2}),
        Map({ title: 'New Feature', key: 'item1', colspan: 1}),
        Map({ title: 'Your Own Module', key: 'item2', colspan: 1}),
        Map({ title: 'Help Other', key: 'item3', colspan: 1}),
        Map({ title: 'Enhancement/won’t fix/unreproducible', key: 'item4', colspan: 1}),
        Map({ title: 'Seniority', key: 'seniority', colspan: 1}),
        Map({ title: 'Score', key: 'score', colspan: 1})
    ),
    moduleTableKeyMap: List.of(
        Map({ title: 'Name', key: 'name', colspan: 2}),
        Map({ title: 'Count', key: 'item1', colspan: 1})
    ),
    moduleTableData: List.of()
});

function customizeTaskData(task) {
    let result = Map();

    Object.keys(task).forEach((key) => {
        switch (key) {
            default:
                result = result.set(key, task[key]);
        }
    });

    return result.toJS();
}

function formatResponse(data) {
    let result = List.of();
    if (data) {
        data.forEach((task) => {
            let updatedTask = customizeTaskData(task);
            result = result.push(OrderedMap(updatedTask));
        });
    }
    return result;
}


function setIntroducedTableData(state, data) {
  let formatedData = formatResponse(data);
  return state.set('introducedTableData', formatedData);
}

function setReleaseState(state, data) {
    var releases = [];
    data.map(release => {
        releases.push({label: release.name, value: release.name});
    });
    return state.set('allProjectVersions', Immutable.fromJS(releases));
}

export default function bugPerformanceReducer(state = initialState, action) {
    let nextState = state;
    switch (action.type) {
        case actionTypes.FETCH_BUG_REPORT_CURRENT_USER:
            nextState = state.set('currentUser', action.data);
            return nextState;
        case actionTypes.SET_BUG_REPORT_PROJECT_VERSION:
            nextState = state.set('currentProjectVersion', action.data);
            return nextState;
        case actionTypes.FETCH_BUG_REPORT_RELEASE:
            nextState = setReleaseState(nextState, action.data);
            return nextState;
        case actionTypes.FETCH_BUG_REPORT_INTRODUCED_SUCCESS:
            nextState = setIntroducedTableData(state, action.data);
            return nextState;
        case actionTypes.FETCH_MODULE_BUGS_STATS_SUCCESS:
            nextState = state.set('moduleTableData', action.data);
            return nextState;
        default:
            return state;
    }
}
