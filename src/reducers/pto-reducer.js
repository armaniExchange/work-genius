import { fromJS, Record } from 'immutable';

import { APPLY_PTO, APPLIED_PTO } from '../actions/pto-page-actions';

export const PTORecord = Record({
        startDate: '',
        toDate: '',
        totalHours: 0,
        applyDate: '',
        status: 'Not Approved',
        memory: ''});

const initPTO = fromJS({
    ptos: [new PTORecord({
        startDate: '2015-08-17',
        toDate: '2015-08-18',
        totalHours: 16,
        applyDate: '2015-08-10',
        status: 'Approved',
        memory: 'go home'
    }),
    new PTORecord({
        startDate: '2015-09-11',
        toDate: '2015-09-13',
        totalHours: 24,
        applyDate: '2015-09-10',
        status: 'Not Approved',
        memory: 'go home'
    })]
});

export default function pto(state = initPTO, action) {

    switch (action.type) {
        case APPLY_PTO:
            return state.update('ptos', ptos => 
                ptos.push(new PTORecord(action.newPTO))
            );
        case APPLIED_PTO:
            return state;
        default:
            return state;
    }
}
