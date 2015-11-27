import { Map, List, fromJS } from 'immutable';

import { APPLY_PTO } from '../actions/pto-page-actions';

const initPTOS = List([
Map({
    startDate: '2015-08-17',
    toDate: '2015-08-18',
    totalHours: 16,
    applyDate: '2015-08-10',
    isApproved: 'Approved',
    memory: 'go home'
}),
Map({
    startDate: '2015-09-11',
    toDate: '2015-09-13',
    totalHours: 24,
    applyDate: '2015-09-10',
    isApproved: 'Not Approved',
    memory: 'go home'
})]);


export default function PTOs(state = initPTOS, action) {

    switch (action.type) {
        case APPLY_PTO: 
            return state.push(fromJS(action.newPTO));
        default:
            return state;
    }
}
