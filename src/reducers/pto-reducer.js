/**
 * @author Howard Chang
 */
// Libraries
import { Map, List, OrderedMap, is } from 'immutable';
import moment from 'moment';
// Constants
import actionTypes from '../constants/action-types';
import { ADMIN_ID } from '../../server/constants/configurations.js';
import {
    PENDING,
    APPROVED,
    DENIED,
    CANCEL_REQUEST_PENDING,
    CANCEL_REQUEST_APPROVED
} from '../constants/pto-constants.js';

const initialPTOFilterConditions = Map({
    'status': ''
});
const initialState = Map({
    applicationsOriginalData: List.of(),
    applications: List.of(),
    overtimeApplicationsOriginalData: List.of(),
    overtimeApplications: List.of(),
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
    overtimeFilterConditions: initialPTOFilterConditions,
    sortPTOTableBy: Map({
        category: '',
        status: 0
    }),
    sortOvertimeTableBy: Map({
        category: '',
        status: 0
    }),
    allUsersWithClosestPTO: List.of(),
    allUsersWithOvertime: List.of(),
    showPTOApplyModal: false,
    showOvertimeApplyModal: false,
    currentSelectedUserID: '',
    selectedYear: moment().get('year'),
    ptoFilterOptions: List(
        [PENDING, APPROVED, DENIED, CANCEL_REQUEST_PENDING, CANCEL_REQUEST_APPROVED].map(status => {
            return Map({
                name: status,
                value: status
            });
        })
    ),
    overtimeFilterOptions: List(
        [PENDING, APPROVED, DENIED].map(status => {
            return Map({
                name: status,
                value: status
            });
        })
    ),
    overtimeTitleKeyMap: List.of(
        Map({ title: 'Date', key: 'start_date'}),
        Map({ title: 'Hours', key: 'hours'}),
        Map({ title: 'Apply Date', key: 'apply_date'}),
        Map({ title: 'Status', key: 'status'}),
        Map({ title: 'Memo', key: 'memo'}),
        Map({ title: 'Applicant', key: 'applicant'}),
        Map({ title: 'Action', key: 'id'})
    ),
    summaryTitleKeyMap: List.of(
        Map({ title: 'Name', key: 'name'}),
        Map({ title: 'Available Overtime Hours', key: 'overtime_hours'})
    )
});

function filterOriginal(state, isOvertime) {
    let nextState = state,
        target = isOvertime ? `overtimeApplications` : `applications`,
        targetOriginalData = isOvertime ? `overtimeApplicationsOriginalData` : `applicationsOriginalData`,
        targetFilterConditions = isOvertime ? `overtimeFilterConditions` : `ptoFilterConditions`;

    nextState = nextState.update(target, () => {
        let keys = nextState.get(targetFilterConditions).keySeq();
        let filteredResult = nextState.get(targetOriginalData).filter((item) => {
            return keys.reduce((acc, key) => {
                if (item.get(key) !== nextState.getIn([targetFilterConditions, key]) && nextState.getIn([targetFilterConditions, key]) !== '') {
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

function sortOriginal(state, isOvertime) {
    let category = isOvertime ? state.get(`sortOvertimeTableBy`).get('category') : state.get(`sortPTOTableBy`).get('category'),
        sortStatus = isOvertime ? state.get(`sortOvertimeTableBy`).get('status') : state.get(`sortPTOTableBy`).get('status'),
        targetKeyMap = isOvertime ? `overtimeTitleKeyMap` : `ptoTitleKeyMap`,
        targetApplications = isOvertime ? `overtimeApplications` : `applications`;

    if (!category || sortStatus === 0) {
        return state;
    }
    state = state.update(targetApplications, (data) => {
        let sorted = data.sort((curr, next) => {
            let result = 0;
            // Get key corresponded to filter title
            let key = state.get(targetKeyMap).filter((map) => {
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

function filterTable(state, filterConditions, isOvertime) {
    let targetConditions = isOvertime ? `overtimeFilterConditions` : `ptoFilterConditions`,
        nextState = state.set(targetConditions, Map(filterConditions));
    nextState = filterOriginal(nextState, isOvertime);
    nextState = sortOriginal(nextState, isOvertime);
    return nextState;
}

function sortTable(state, newCategory, isOvertime) {
    let oldCategory = isOvertime ? state.get(`sortOvertimeTableBy`).get('category') : state.get(`sortPTOTableBy`).get('category');
    let oldStatus = isOvertime ? state.get(`sortOvertimeTableBy`).get('status') : state.get(`sortPTOTableBy`).get('status');
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
    state = isOvertime ? state.set(`sortOvertimeTableBy`, category) : state.set(`sortPTOTableBy`, category);
    state = filterOriginal(state, isOvertime);
    state = sortOriginal(state, isOvertime);
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

function setTableData(state, data, isOvertime) {
    let formatedData = formatResponse(data),
        targetOriginalData = isOvertime ? `overtimeApplicationsOriginalData` : `applicationsOriginalData`,
        targetApplications = isOvertime ? `overtimeApplications` : `applications`;
    return state
        .set(targetOriginalData, formatedData)
        .set(targetApplications, formatedData);
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

function resetTable(state) {
    return state
        .update(`applications`, () => {
            return state.get(`applicationsOriginalData`);
        })
        .set(`sortPTOTableBy`, Map({
            category: '',
            status: 0
        }))
        .set(
            `ptoFilterConditions`,
            initialState.get(`ptoFilterConditions`)
        )
        .set(
            `selectedYear`,
            moment().get('year')
        )
        .update(`overtimeApplications`, () => {
            return state.get(`overtimeApplicationsOriginalData`);
        })
        .set(`sortOvertimeTableBy`, Map({
            category: '',
            status: 0
        }))
        .set(
            `overtimeFilterConditions`,
            initialState.get(`ptoFilterConditions`)
        );
}

export default function ptoReducer(state = initialState, action) {
    let nextState = state;
    switch (action.type) {
        case actionTypes.SET_PTO_APPLY_MODAL_STATE:
            return state.set('showPTOApplyModal', action.state);
        case actionTypes.SET_OVERTIME_APPLY_MODAL_STATE:
            return state.set('showOvertimeApplyModal', action.state);
        case actionTypes.SORT_PTO_TABLE_BY_CATEGORY:
            return sortTable(state, action.category);
        case actionTypes.SORT_OVERTIME_TABLE_BY_CATEGORY:
            return sortTable(state, action.category, true);
        case actionTypes.FILTER_PTO_TABLE:
            return filterTable(state, action.filterConditions);
        case actionTypes.FILTER_OVERTIME_TABLE:
            return filterTable(state, action.filterConditions, true);
        case actionTypes.RESET_PTO_TABLE:
            return resetTable(state);
        case actionTypes.FETCH_OVERTIME_APPLICATION_SUCCESS:
            nextState = setTableData(state, action.data, true);
            if (!is(state.get('overtimeFilterConditions'), initialPTOFilterConditions)) {
                nextState = filterOriginal(nextState, true);
            }
            if (state.get('sortOvertimeTableBy').get('category')) {
                nextState = sortOriginal(nextState, true);
            }
        return nextState;
        case actionTypes.FETCH_PTO_APPLICATION_SUCCESS:
            nextState = setTableData(state, action.data);
            if (!is(state.get('ptoFilterConditions'), initialPTOFilterConditions)) {
                console.log('I SHOULD FILTER!~');
                nextState = filterOriginal(nextState);
            }
            if (state.get('sortPTOTableBy').get('category')) {
                nextState = sortOriginal(nextState);
            }
            return nextState;
        case actionTypes.FETCH_USERS_WITH_PTO_SUCCESS:
            let newAllUsersWithClosestPTO = action.data.map((user) => {
                return {
                    id: user.id,
                    name: user.name,
                    subtitle: findClosestDateToToday(user.pto.map((application) => application.end_date))
                };
            });
            return nextState.set('allUsersWithClosestPTO', newAllUsersWithClosestPTO);
        case actionTypes.FETCH_USERS_WITH_OVERTIME_SUCCESS:
            return nextState.set('allUsersWithOvertime', action.data);
        case actionTypes.SET_CURRENT_SELECTED_USER_ID:
            return nextState.set('currentSelectedUserID', action.id === ADMIN_ID ? '' : action.id);
        case actionTypes.DECREASE_YEAR:
            return nextState.update('selectedYear', year => year - 1);
        case actionTypes.INCREASE_YEAR:
            return nextState.update('selectedYear', year => year + 1);
        default:
            return state;
    }
}
