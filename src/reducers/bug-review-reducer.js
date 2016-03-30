/**
 * @author Howard Chang
 */
// Libraries
import { Map, List, OrderedMap} from 'immutable';
// Constants
import * as actionTypes from '../constants/action-types';
// import { ADMIN_ID } from '../../server/constants/configurations.js';
// const initialPTOFilterConditions = Map({
//     'status': ''
// });

const initialState = Map({
    applications: List.of(),
    bugReviewTitleKeyMap: List.of(
        Map({ title: 'Bug ID', key: 'id', colspan: 1}),
        Map({ title: 'Title', key: 'title', colspan: 3}),
        Map({ title: 'Root Cause', key: 'resolved_type', colspan: 3}),
        Map({ title: 'Prevent Tags', key: 'tags', colspan: 3}),
        Map({ title: 'Belongs To Menu', key: 'menu', colspan: 2}),
        Map({ title: 'Owner', key: 'assigned_to', colspan: 1}),
        Map({ title: 'Bug Resolved Status', key: 'resolved_status', colspan: 1}),
        Map({ title: 'Root Cause Detail', key: 'review', colspan: 2})
    ),
    // allProjectVersions: List.of('4.1.0', '3.2.1', '3.2.0'),
    allProjectVersions: List.of(
        Map({title: '4.1.0', value: '4.1.0'}),
        Map({title: '3.2.0', value: '3.2.0'}),
        Map({title: '3.2.1', value: '3.2.1'})
    ),
    currentProjectVersion: '',
    currentSelectPreventTag: '',
    currentSelectMenu: '',
    currentSelectRootCause: '',
    allUsers: List.of(),
    currentSelectUser: Map({}),
    resolvedReasonTypes: List.of(
        Map({ label: 'Gui Code issue', value: 'code_issue' }),
        Map({ label: 'AXAPI', value: 'axapi' }),
        Map({ label: 'Look and feel', value: 'look_and_feel' }),
        Map({ label: 'Requirement change', value: 'requirement_change' }),
        Map({ label: 'Browser related', value: 'brower_related' })
    ),
    optionsReviewTags: List.of(
        Map({ value: 'test_more', label: 'Test More'}),
        Map({ value: 'deep_test', label: 'Deep Test'})
    ),
    optionsMenus: List.of(
         Map({ value: 'slb', label: 'SLB'}),
         Map({ value: 'gslb', label: 'GSLB'}),
         Map({ value: 'system', label: 'System'}),
         Map({ value: 'network', label: 'Network'}),
         Map({ value: 'adc', label: 'ADC'}),
         Map({ value: 'ssli', label: 'SSLi'}),
         Map({ value: 'security', label: 'Security'})
    )
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

function setTableData(state, data) {
    let formatedData = formatResponse(data);
    return state
        .set(`applicationsOriginalData`, formatedData)
        .set(`applications`, formatedData);
}

function setPreventTagData(state, data) {
    let result = List.of();
    data.forEach((tag) => {
        let updateTag = Map({value: tag.tag_name, label: tag.tag_name});
        result = result.push(updateTag);
    });
    return state.set(`optionsReviewTags`, result);
}

function addReviewTagData(state, data){
    var options = state.get(`optionsReviewTags`);
    if (data) {
        options = options.push(Map({value: data, label: data}));
    }
    return state.set('optionsReviewTags', options);
}

function setAllUsers(state, data){
    let result = List.of();
    data.forEach((user) => {
        let updateUser = Map({title: user.name, value: user.alias});
        result = result.push(updateUser);
    });
    return state.set(`allUsers`, result);
}

function setSelectUser(state, userAlisa){
    let allUsers = state.get(`allUsers`);
    allUsers.forEach((userMap) => {
        var alisa = userMap.get('value');
        if (alisa === userAlisa) {
            state = state.set(`currentSelectUser`, userMap);
        }
    });
    return state;
}

function changeOptions(state, data) {
    var applications = state.get(`applications`);
    var result = List.of();
    applications.forEach((application) => {
        if ( String(application.get(`id`)) === String(data.id)){
            console.log(customizeTaskData(data));
            result = result.push(OrderedMap(customizeTaskData(data)));
        } else {
            result = result.push(application);
        }
    });
    console.log(result.toJS());
    return state.set(`applications`, result);
}

export default function bugReviewReducer(state = initialState, action) {
    let nextState = state;
    switch (action.type) {
        case actionTypes.FETCH_BUG_REVIEW_APPLICATION_SUCCESS:
            nextState = setTableData(state, action.data);
            return nextState;
        case actionTypes.FETCH_BUG_REVIEW_CHANGE_OPTIONS_SUCCESS:
            nextState = changeOptions(nextState, action.data);
            return nextState;
        case actionTypes.FETCH_BUG_REVIEW_PREVENT_TAGS_OPTIONS:
            nextState = setPreventTagData(nextState, action.data);
            return nextState;
        case actionTypes.FETCH_BUG_REVIEW_ADD_OPTIONS_SUCCESS:
            nextState = addReviewTagData(nextState, action.data);
            return nextState;
        case actionTypes.FETCH_BUG_REVIEW_ALL_USERS:
            nextState = setAllUsers(state, action.data);
            return nextState;
        case actionTypes.SET_BUG_REVIEW_SELECT_USER:
            nextState = setSelectUser(state, action.data);
            return nextState;
        case actionTypes.SET_BUG_REVIEW_PROJECT_VERSION:
            nextState = nextState.set(`currentProjectVersion`, action.data);
            return nextState;
        default:
            return state;
    }
}
