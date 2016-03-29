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
        Map({ title: 'Bug ID', key: 'id', colspan: '1'}),
        Map({ title: 'Title', key: 'title', colspan: '3'}),
        Map({ title: 'Root Cause', key: 'resolved_type', colspan: '3'}),
        Map({ title: 'Prevent Tags', key: 'tags', colspan: '3'}),
        Map({ title: 'Belongs To Menu', key: 'menu', colspan: '2'}),
        Map({ title: 'Owner', key: 'assigned_to', colspan: '1'}),
        Map({ title: 'Bug Resolved Status', key: 'resolved_status', colspan: '1'}),
        Map({ title: 'Root Cause Detail', key: 'review', colspan: '2'})
    ),
    allProjectVersions: List.of('4.1.0', '3.2.1', '3.2.0'),
    allUsers: List.of(),
    resolvedReasonTypes: List.of(
        Map({ label: 'AXAPI', value: 'axapi' }),
        Map({ label: 'Brower related', value: 'brower_related' }),
        Map({ label: 'Requirement change', value: 'requirement_change' }),
        Map({ label: 'Look and feel', value: 'look_and_feel' }),
        Map({ label: 'Code issue', value: 'code_issue' })
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

function setAllUsers(state, data){
    return state.set(`allUsers`, data);
}

export default function bugReviewReducer(state = initialState, action) {
    let nextState = state;
    switch (action.type) {
        case actionTypes.FETCH_BUG_REVIEW_APPLICATION_SUCCESS:
            nextState = setTableData(state, action.data);
            // if (!is(state.get('ptoFilterConditions'), initialPTOFilterConditions)) {
            //     nextState = filterOriginal(nextState);
            // }
            // if (state.get('sortPTOTableBy').get('category')) {
            //     nextState = sortOriginal(nextState);
            // }
            return nextState;
        case actionTypes.FETCH_BUG_REVIEW_CHANGE_OPTIONS_SUCCESS:
            return nextState;
        case actionTypes.FETCH_BUG_REVIEW_PREVENT_TAGS_OPTIONS:
            nextState = setPreventTagData(nextState, action.data);
            return nextState;
        case actionTypes.FETCH_BUG_REVIEW_ALL_USERS:
            nextState = setAllUsers(state, action.data);
            return nextState;
        default:
            return state;
    }
}
