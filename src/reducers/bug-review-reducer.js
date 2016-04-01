/**
 * @author Howard Chang
 */
// Libraries
import { Map, List, OrderedMap} from 'immutable';
// Constants
import actionTypes from '../constants/action-types';
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
        Map({ title: 'Bug Resolved Status', key: 'resolved_status', colspan: 2}),
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
    pager: Map({ totalRow: 0, pageRow: 25, rowIndex: 1, pageSize: 0 }),
    resolvedReasonTypes: List.of(
        Map({ label: 'GUI Code Issue', value: 'GUI Code Issue' }),
        Map({ label: 'AXAPI', value: 'AXAPI' }),
        Map({ label: 'Look and Feel', value: 'Look and Feel' }),
        Map({ label: 'Requirement Change', value: 'Requirement Change' }),
        Map({ label: 'Browser Related', value: 'Browser Related' })
    ),
    optionsReviewTags: List.of(
        Map({ value: 'test_more', label: 'Test More'}),
        Map({ value: 'deep_test', label: 'Deep Test'})
    ),
    optionsMenus: List.of(
        Map({ value: 'Dashboard', label: 'Dashboard'}),
        Map({ value: 'ADC', label: 'ADC'}),
        Map({ value: 'SLB', label: 'SLB'}),
        Map({ value: 'GSLB', label: 'GSLB'}),
        Map({ value: 'Security', label: 'Security'}),
        Map({ value: 'SSLi', label: 'SSLi'}),
        Map({ value: 'AAM', label: 'AAM'}),
        Map({ value: 'CGN', label: 'CGN'}),
        Map({ value: 'Network', label: 'Network'}),
        Map({ value: 'System', label: 'System'})
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

function setTableData(state, data, pager) {
    let formatedData = formatResponse(data);
    if ( formatedData.size > 0 ) {
        let one = formatedData.get(0);
        let totalRow = one.get('total_row');
        pager.totalRow = totalRow;
        pager.pageSize = parseInt(totalRow / pager.pageRow);
        pager.pageSize = totalRow % pager.pageRow === 0 ? pager.pageSize : pager.pageSize + 1;
    } else {
        pager.totalRow = 0;
        pager.pageSize = 0;
    }
    state = state.set(`pager`, pager);
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
    let isAll = true;
    allUsers.forEach((userMap) => {
        var alisa = userMap.get('value');
        if (alisa === userAlisa) {
            isAll = false;
            state = state.set(`currentSelectUser`, userMap);
        }
    });
    if (isAll) {
        state = state.set(`currentSelectUser`, Map({title: 'All'}));
    }
    return state;
}

function changeOptions(state, data) {
    var applications = state.get(`applications`);
    var result = List.of();
    applications.forEach((application) => {
        if ( String(application.get(`id`)) === String(data.id)){
            result = result.push(OrderedMap(customizeTaskData(data)));
        } else {
            result = result.push(application);
        }
    });
    return state.set(`applications`, result);
}

export default function bugReviewReducer(state = initialState, action) {
    let nextState = state;
    switch (action.type) {
        case actionTypes.FETCH_BUG_REVIEW_QUERY_DATA:
            // Set query data and pager.
            nextState = setTableData(nextState, action.data, action.pager);
            // Set select user.
            nextState = setSelectUser(nextState, action.user);
            // Set query project version.
            nextState = nextState.set(`currentProjectVersion`, action.version);
            // Set query menu.
            nextState = nextState.set(`currentSelectMenu`, action.menu);
            // Set query prevent tag
            nextState = nextState.set(`currentSelectPreventTag`, action.tag);
            // Set query root cause.
            nextState = nextState.set(`currentSelectRootCause`, action.cause);
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
        default:
            return state;
    }
}
