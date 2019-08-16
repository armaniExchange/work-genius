/**
 * @author Howard Chang
 */
// Libraries
import Immutable, { Map, List, OrderedMap } from 'immutable';
// Constants
import actionTypes from '../constants/action-types';
// import { ADMIN_ID } from '../../server/constants/configurations.js';
// const initialPTOFilterConditions = Map({
//     'status': ''
// });

const initialState = Map({
    applications: List.of(),
    bugReviewTitleKeyMap: List.of(
        Map({ title: 'Bug ID', key: 'id', colspan: 1 }),
        Map({ title: 'Title', key: 'title', colspan: 3 }),
        Map({ title: 'Root Cause', key: 'resolved_type', colspan: 3 }),
        Map({ title: 'Prevent Tags', key: 'tags', colspan: 2 }),
        Map({ title: 'Belongs To Menu', key: 'menu', colspan: 2 }),
        Map({ title: 'Fixer', key: 'assigned_to', colspan: 1 }),
        Map({ title: 'Owner', key: 'owner', colspan: 2 }),
        Map({ title: 'Introduced By', key: 'introduced_by', colspan: 2 }),
        Map({ title: 'Resolved Status', key: 'resolved_status', colspan: 2 }),
        Map({ title: 'Root Cause Detail', key: 'review', colspan: 2 })
    ),
    allProjectVersions: List.of(),
    currentProjectVersion: '',
    currentSelectPreventTag: '',
    currentSelectMenu: '',
    currentSelectRootCause: '',
    allUsers: List.of(),
    currentSelectUser: Map({}),
    pager: Map({ totalRow: 0, pageRow: 25, rowIndex: 1, pageSize: 0 }),
    resolvedReasonTypes: List.of(
        // For Acos
        // Map({ label: 'Usability', value: 'Usability' }),
        // Map({ label: 'GUI Code Issue', value: 'GUI Code Issue' }),
        // // Map({ label: 'AXAPI', value: 'AXAPI' }),
        // Map({ label: 'AXAPI Changed', value: 'AXAPI Changed' }),
        // Map({ label: 'Look and Feel', value: 'Look and Feel' }),
        // Map({ label: 'Requirement Change', value: 'Requirement Change' }),
        // Map({ label: 'Browser Related', value: 'Browser Related' }),
        // Map({ label: 'Cannot be Reproduced', value: 'Cannot be Reproduced' }),
        // Map({ label: 'AXAPI Not Supported', value: 'AXAPI Not Supported' }),
        // Map({ label: 'GUI Not Supported', value: 'GUI Not Supported' }),
        // Map({ label: 'Duplicate', value: 'Duplicate' }),
        // Map({ label: 'NAB/By Design', value: 'NAB/By Design' }),
        // Map({ label: 'Working in current build', value: 'Working in current build' }),
        // Map({ label: 'Enhancement', value: 'Enhancement' }),
        // Map({ label: 'Others', value: 'Others' })
        // For HC
        Map({ label: 'GOE', value: 'GOE' }),
        Map({ label: 'REQUIREMENT', value: 'REQUIREMENT' }),
        Map({ label: 'USABILITY', value: 'USABILITY' }),
        Map({ label: 'LOOK_FEEL', value: 'LOOK_FEEL' }),
        Map({ label: 'WONTFIX', value: 'WONTFIX' }),
        Map({ label: 'DUPLICATE', value: 'DUPLICATE' }),
        Map({ label: 'UNREPRODUCE', value: 'UNREPRODUCE' }),
        Map({ label: 'AUTOFORM_VALIDATION', value: 'AUTOFORM_VALIDATION' }),
        Map({ label: 'AUTOFORM_BACKEND_CHANGE', value: 'AUTOFORM_BACKEND_CHANGE' }),
        Map({ label: 'AUTOFORM_CUSTOM', value: 'AUTOFORM_CUSTOM' }),
        Map({ label: 'AUTOFORM_UI_STYLE', value: 'AUTOFORM_UI_STYLE' }),
        Map({ label: 'AUTOFORM_TAG_ERROR', value: 'AUTOFORM_TAG_ERROR' }),
        Map({ label: 'AUTOFORM_ENHANCEMENT', value: 'AUTOFORM_ENHANCEMENT' }),
        Map({ label: 'AUTOFORM_CODE_ISSUE', value: 'AUTOFORM_CODE_ISSUE' })
    ),
    optionsReviewTags: List.of(
        Map({ value: 'test_more', label: 'Test More' }),
        Map({ value: 'deep_test', label: 'Deep Test' })
    ),
    optionsIntroduced: List.of(
        Map({ value: 'New feature', label: 'New feature' }),
        Map({ value: 'Your own module', label: 'Your own module' }),
        Map({ value: 'Help other team member', label: 'Help other team member' }),
        Map({ value: 'Enhancement bug/won’t fix/unreproducible', label: 'Enhancement bug/won’t fix/unreproducible' })
    ),
    optionsMenus: List.of(
        Map({ value: 'Dashboard', label: 'Dashboard' }),
        Map({ value: 'ADC', label: 'ADC' }),
        Map({ value: 'SLB', label: 'SLB' }),
        Map({ value: 'GSLB', label: 'GSLB' }),
        Map({ value: 'Security', label: 'Security' }),
        Map({ value: 'SSLi', label: 'SSLi' }),
        Map({ value: 'AAM', label: 'AAM' }),
        Map({ value: 'CGN', label: 'CGN' }),
        Map({ value: 'Network', label: 'Network' }),
        Map({ value: 'System', label: 'System' })
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
    if (formatedData.size > 0) {
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
        let updateTag = Map({ value: tag.tag_name, label: tag.tag_name });
        result = result.push(updateTag);
    });
    return state.set(`optionsReviewTags`, result);
}

function addReviewTagData(state, data) {
    var options = state.get(`optionsReviewTags`);
    if (data) {
        options = options.push(Map({ value: data, label: data }));
    }
    return state.set('optionsReviewTags', options);
}

function setAllUsers(state, data) {
    let result = List.of();
    data.forEach((user) => {
        let updateUser = Map({ title: user.name, value: user.alias, id: user.id });
        result = result.push(updateUser);
    });
    return state.set(`allUsers`, result);
}

function setSelectUser(state, userAlisa) {
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
        state = state.set(`currentSelectUser`, Map({ title: 'All' }));
    }
    return state;
}

function changeOptions(state, data) {
    var applications = state.get(`applications`);
    var result = List.of();
    applications.forEach((application) => {
        if (String(application.get(`id`)) === String(data.id)) {
            result = result.push(OrderedMap(customizeTaskData(data)));
        } else {
            result = result.push(application);
        }
    });
    return state.set(`applications`, result);
}

function setReleaseState(state, data) {
    var releases = [];
    data.map(release => {
        releases.push({ title: release.name, value: release.name });
    });
    return state.set('allProjectVersions', Immutable.fromJS(releases));
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
        case actionTypes.FETCH_BUG_REVIEW_RELEASE:
            nextState = setReleaseState(nextState, action.data);
            return nextState;
        default:
            return state;
    }
}
