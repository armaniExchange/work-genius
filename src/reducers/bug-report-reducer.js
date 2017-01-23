// Libraries
import Immutable, { Map, List, OrderedMap} from 'immutable';
// Constants
import actionTypes from '../constants/action-types';

const initialState = Map({
    rootCauseTableData: List.of(),
    tagsTableData: List.of(),
    ownerTableData: List.of(),
    ownerTotalData: List.of(),
    introducedTableData: List.of(),
    rootCauseTableTitleKeyMap: List.of(
        Map({ title: 'Root Cause', key: 'name', colspan: 1}),
        Map({ title: 'Num', key: 'number', colspan: 1}),
        Map({ title: 'Percentage', key: 'percentage', colspan: 1})
    ),
    tagsTableTitleKeyMap: List.of(
        Map({ title: 'Resolved Type', key: 'name', colspan: 1}),
        Map({ title: 'Num', key: 'number', colspan: 1}),
        Map({ title: 'Percentage', key: 'percentage', colspan: 1})
    ),
    ownerTableTitleKeyMap: List.of(
        Map({ title: 'Owner', key: 'name', colspan: 1}),
        Map({ title: 'GUI Code Issue', key: 'item1', colspan: 1}),
        Map({ title: 'AXAPI', key: 'item2', colspan: 1}),
        Map({ title: 'Look and Feel', key: 'item3', colspan: 1}),
        Map({ title: 'Requirement Change', key: 'item4', colspan: 1}),
        Map({ title: 'Browser Related', key: 'item5', colspan: 1}),
        Map({ title: 'Others', key: 'item6', colspan: 1})
    ),
    introducedTableTitleKeyMap: List.of(
        Map({ title: 'Owner', key: 'name', colspan: 1}),
        Map({ title: 'New Feature', key: 'item1', colspan: 1}),
        Map({ title: 'Your Own Module', key: 'item2', colspan: 1}),
        Map({ title: 'Help Other Team Memeber', key: 'item3', colspan: 1}),
        Map({ title: 'Enhancement', key: 'item4', colspan: 1}),
        Map({ title: 'Seniority', key: 'seniority', colspan: 1}),
        Map({ title: 'Score', key: 'score', colspan: 1})
    ),
    // allProjectVersions: List.of('4.1.0', '3.2.1', '3.2.0'),
    allProjectVersions: List.of(),
    currentProjectVersion: ''
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

    data.forEach((task) => {
        let updatedTask = customizeTaskData(task);
        result = result.push(OrderedMap(updatedTask));
    });

    return result;
}

function setRootCauseTableData(state, data) {
    let formatedData = formatResponse(data);
    return state
        .set(`rootCauseTableData`, formatedData);
}

function setOwnerTotalData(state, data){
    let formatedData = formatResponse(data);
    return state
        .set(`ownerTotalData`, formatedData);
}

function setTagsTableData(state, data) {
    let formatedData = formatResponse(data);
    return state
        .set(`tagsTableData`, formatedData);
}

function setOwnerTableData(state, data) {
    let formatedData = formatResponse(data);
    return state
        .set(`ownerTableData`, formatedData);
}

function setIntroducedTableData(state, data) {
  let formatedData = formatResponse(data);
  return state.set('introducedTableData', formatedData);
}

function setReleaseState(state, data) {
    var releases = [];
    data.map(release => {
        releases.push({title: release.name, value: release.name});
    });
    return state.set('allProjectVersions', Immutable.fromJS(releases));
}

export default function bugReportReducer(state = initialState, action) {
    let nextState = state;
    switch (action.type) {
        case actionTypes.FETCH_BUG_REPORT_ROOT_CAUSE_SUCCESS:
            nextState = setRootCauseTableData(state, action.data);
            return nextState;
        case actionTypes.FETCH_BUG_REPORT_TAGS_SUCCESS:
            nextState = setTagsTableData(state, action.data);
            return nextState;
        case actionTypes.FETCH_BUG_REPORT_OWNER_SUCCESS:
            nextState = setOwnerTableData(state, action.data);
            return nextState;
        case actionTypes.FETCH_BUG_REPORT_INTRODUCED_SUCCESS:
            nextState = setIntroducedTableData(state, action.data);
            return nextState;
        case actionTypes.FETCH_BUG_REPORT_OWNER_TOTAL_SUCCESS:
            nextState = setOwnerTotalData(state, action.data);
            return nextState;
        case actionTypes.SET_BUG_REPORT_PROJECT_VERSION:
            nextState = state.set(`currentProjectVersion`, action.data);
            return nextState;
        case actionTypes.FETCH_BUG_REPORT_RELEASE:
            nextState = setReleaseState(nextState, action.data);
            return nextState;
        default:
            return state;
    }
}
