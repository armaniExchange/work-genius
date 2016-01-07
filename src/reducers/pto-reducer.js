/**
 * @author Howard Chang
 */

// Libraries
import { Map, List } from 'immutable';
// Constants
import * as actionTypes from '../constants/action-types';

const initialPTOFilterConditions = Map({
    'status': ''
});

const initialState = Map({
    applicationsOriginalData: List.of(
        Map({
            'start_date': '2016/01/07',
            'end_date': '2016/01/08',
            'applied_date': '2016/01/07',
            'hours': '8',
            'applicant': 'Howard',
            'status': 'APPROVED',
            'memo': 'Test1',
            'id': '111'
        }),
        Map({
            'start_date': '2016/02/09',
            'end_date': '2016/02/10',
            'applied_date': '2016/02/07',
            'hours': '16',
            'applicant': 'Roll',
            'status': 'PENDING',
            'memo': 'Test2',
            'id': '222'
        }),
        Map({
            'start_date': '2016/03/07',
            'end_date': '2016/03/28',
            'applied_date': '2016/03/01',
            'hours': '68',
            'applicant': 'Howard',
            'status': 'DENIED',
            'memo': 'Test3',
            'id': '333'
        })
    ),
    applications: List.of(
        Map({
            'start_date': '2016/01/07',
            'end_date': '2016/01/08',
            'applied_date': '2016/01/07',
            'hours': '8',
            'applicant': 'Howard',
            'status': 'APPROVED',
            'memo': 'Test1',
            'id': '111'
        }),
        Map({
            'start_date': '2016/02/09',
            'end_date': '2016/02/10',
            'applied_date': '2016/02/07',
            'hours': '16',
            'applicant': 'Roll',
            'status': 'PENDING',
            'memo': 'Test2',
            'id': '222'
        }),
        Map({
            'start_date': '2016/03/07',
            'end_date': '2016/03/28',
            'applied_date': '2016/03/01',
            'hours': '68',
            'applicant': 'Howard',
            'status': 'DENIED',
            'memo': 'Test3',
            'id': '333'
        })
    ),
    ptoTitleKeyMap: List.of(
        Map({ title: 'Start Date', key: 'start_date'}),
        Map({ title: 'End Date', key: 'end_date'}),
        Map({ title: 'Total Hours', key: 'hours'}),
        Map({ title: 'Applied Date', key: 'applied_date'}),
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

export default function ptoReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.SET_PTO_APPLY_MODAL_STATE:
            return state.set('showPTOApplyModal', action.state);
        case actionTypes.SORT_PTO_TABLE_BY_CATEGORY:
            return sortTable(state, action.category);
        case actionTypes.FILTER_PTO_TABLE:
            return filterTable(state, action.filterConditions);
        default:
            return state;
    }
}
