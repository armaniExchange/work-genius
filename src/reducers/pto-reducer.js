/**
 * @author Howard Chang
 */

// Libraries
import { Map, List } from 'immutable';
// Constants
import * as actionTypes from '../constants/action-types';

const initialState = Map({
    applications: List.of(
        Map({
            'startDate': '2016/01/07',
            'endDate': '2016/01/08',
            'appliedDate': '2016/01/07',
            'hours': 8,
            'applicant': 'Howard',
            'status': 'approved',
            'memo': 'Test'
        })
    ),
    showPTOApplyModal: false
});

export default function ptoReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.SET_PTO_APPLY_MODAL_STATE:
            return state.set('showPTOApplyModal', action.state);
        default:
            return state;
    }
}
