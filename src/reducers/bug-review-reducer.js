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
        Map({ title: 'Bug ID', key: 'id'}),
        Map({ title: 'Title', key: 'title'}),
        Map({ title: 'Resovled Reason Type', key: 'resolved_type'}),
        Map({ title: 'Review Tags', key: 'tags'}),
        Map({ title: 'Menu Tag', key: 'menu_tag'}),
        Map({ title: 'Owner', key: 'assigned_to'}),
        Map({ title: 'Review', key: 'review'})
    ),
    allProjectVersions: List.of('22', '22ss')
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
        default:
            return state;
    }
}
