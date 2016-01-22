/**
 * @author Howard Chang
 */
// Libraries
import { Map, List, OrderedMap, is } from 'immutable';
import moment from 'moment';
// Constants
import * as actionTypes from '../constants/action-types';

const initialPTOFilterConditions = Map({
    'status': '',
    'applicant': ''
});

const initialState = Map({
    applicationsOriginalData: List.of(),
    applications: List.of(),
    ptoTitleKeyMap: List.of(
        Map({ title: 'Start Date', key: 'start_date'}),
        Map({ title: 'End Date', key: 'end_date'}),
        Map({ title: 'Total Hours', key: 'hours'}),
        Map({ title: 'Apply Date', key: 'apply_date'}),
        Map({ title: 'Status', key: 'status'}),
        Map({ title: 'Memo', key: 'memo'}),
        Map({ title: 'Applicant', key: 'applicant'}),
        Map({ title: 'Action', key: 'id'})
    ),
    ptoFilterConditions: initialPTOFilterConditions,
    sortPTOTableBy: Map({
        category: '',
        status: 0
    }),
    allUsersWithClosestPTO: List.of(),
    showPTOApplyModal: false
});

function filterOriginal(state) {
    let nextState = state;
    nextState = nextState.update(`applications`, () => {
        let keys = nextState.get(`ptoFilterConditions`).keySeq();
        let filteredResult = nextState.get(`applicationsOriginalData`).filter((item) => {
            return keys.reduce((acc, key) => {
                if (item.get(key) !== nextState.getIn([`ptoFilterConditions`, key]) && nextState.getIn([`ptoFilterConditions`, key]) !== '') {
                    return acc && false;
                }
                return acc && true;
            }, true);
        });
        return filteredResult.isEmpty() ? List.of() : filteredResult;
    });
    return nextState;
}

function sortAlphaNum(a,b) {
    let reA = /[^a-zA-Z]/g;
    let reN = /[^0-9]/g;
    let aA = a.replace(reA, '');
    let bA = b.replace(reA, '');

    if (aA === bA) {
        let aN = parseInt(a.replace(reN, ''), 10);
        let bN = parseInt(b.replace(reN, ''), 10);
        return aN === bN ? 0 : aN > bN ? 1 : -1;
    }

    return aA > bA ? 1 : -1;
}

function sortOriginal(state) {
    let category = state.get(`sortPTOTableBy`).get('category');
    let sortStatus = state.get(`sortPTOTableBy`).get('status');

    if (!category || sortStatus === 0) {
        return state;
    }
    state = state.update(`applications`, (data) => {
        let sorted = data.sort((curr, next) => {
            let result = 0;
            // Get key corresponded to filter title
            let key = state.get(`ptoTitleKeyMap`).filter((map) => {
                return map.get('title') === category;
            }).first().get('key');
            let tempResult = sortAlphaNum(curr.get(key).toString(10), next.get(key).toString(10));
            if (tempResult !== 0 && result === 0) {
                result = tempResult;
            }
            return result;
        });

        if (sortStatus === -1) {
            return sorted.reverse();
        }

        return sorted;
    });

    return state;
}

function filterTable(state, filterConditions) {
    let nextState = state.set(`ptoFilterConditions`, Map(filterConditions));
    nextState = filterOriginal(nextState);
    nextState = sortOriginal(nextState);
    return nextState;
}

function sortTable(state, newCategory, type) {
    let oldCategory = state.get(`sortPTOTableBy`).get('category');
    let oldStatus = state.get(`sortPTOTableBy`).get('status');
    let newStatus = 0;
    if (oldCategory === newCategory) {
        newStatus = oldStatus === 1 ? -1 : oldStatus === -1 ? 0 : 1;
    } else {
        newStatus = 1;
    }
    let category = Map({
        category: newCategory,
        status: newStatus
    });
    state = state.set(`sortPTOTableBy`, category);
    state = filterOriginal(state, type);
    state = sortOriginal(state, type);
    return state;
}

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

function findClosestDateToToday(dates) {
    let result = undefined,
        today = moment().format('YYYY-MM-DD');;

    if (dates.length !== 0) {
        result = dates.reduce((acc, x) => {
            let accMoment = moment(acc),
                xMoment = moment(x),
                accDiff = Math.abs(parseInt(accMoment.diff(today, 'days'), 10)),
                xDiff = Math.abs(parseInt(xMoment.diff(today, 'days'), 10));
            return (accDiff <= xDiff) ? acc : x;
        });
    }

    return result;
}

export default function ptoReducer(state = initialState, action) {
    let nextState = state;
    switch (action.type) {
        case actionTypes.SET_PTO_APPLY_MODAL_STATE:
            return state.set('showPTOApplyModal', action.state);
        case actionTypes.SORT_PTO_TABLE_BY_CATEGORY:
            return sortTable(state, action.category);
        case actionTypes.FILTER_PTO_TABLE:
            return filterTable(state, action.filterConditions);
        case actionTypes.FETCH_PTO_APPLICATION_SUCCESS:
            nextState = setTableData(state, action.data);
            if (!is(state.get('ptoFilterConditions'), initialPTOFilterConditions)) {
                nextState = filterOriginal(nextState);
            }
            if (state.get('sortPTOTableBy').get('category')) {
                nextState = sortOriginal(nextState);
            }
            return nextState;
        case actionTypes.FETCH_USERS_WITH_PTO_SUCCESS:
            let newAllUsersWithClosestPTO = action.data.map((user) => {
                return {
                    name: user.name,
                    closestPTO: findClosestDateToToday(user.pto.map((application) => application.end_date))
                };
            });
            return nextState.set('allUsersWithClosestPTO', newAllUsersWithClosestPTO);
        case actionTypes.GET_CURRENT_USER_SUCCESS:
            return nextState.setIn(['ptoFilterConditions', 'applicant'], action.user.name);
        default:
            return state;
    }
}
