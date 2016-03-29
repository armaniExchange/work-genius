/**
 * @author Howard Chang
 */
// Libraries
import { Map, List, OrderedMap} from 'immutable';
// Constants
import * as actionTypes from '../constants/action-types';

// const initialPTOFilterConditions = Map({
//     'status': ''
// });

const initialState = Map({
    applications: List.of(),
    bugReviewTitleKeyMap: List.of(
        Map({ title: 'Bug ID', key: 'id', colspan: '1'}),
        Map({ title: 'Title', key: 'title', colspan: '2'}),
        Map({ title: 'Resovled Reason Type', key: 'resolved_type', colspan: '2'}),
        Map({ title: 'Review Tags', key: 'tags', colspan: '1'}),
        Map({ title: 'Menu Tag', key: 'menu_tag', colspan: '1'}),
        Map({ title: 'Owner', key: 'assigned_to', colspan: '1'}),
        Map({ title: 'Review', key: 'review', colspan: '1'})
    ),
    allProjectVersions: List.of('4.1.0', '3.2.1', '3.2.0'),
    resolvedReasonTypes: List.of(
        Map({ name: 'AXAPI', value: 'axapi' }),
        Map({ name: 'Brower related', value: 'brower_related' }),
        Map({ name: 'Requirement change', value: 'requirement_change' }),
        Map({ name: 'Look and feel', value: 'look_and_feel' }),
        Map({ name: 'Code issue', value: 'code_issue' })
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
        case actionTypes.FETCH_BUG_REVIEW_CHANGE_RESOLVE_REASON_TYPE:
            return nextState;
        default:
            return state;
    }
}
