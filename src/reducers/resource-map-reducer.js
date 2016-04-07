
import { Map } from 'immutable';
// Constants
import actionTypes from '../constants/action-types';
// import { ADMIN_ID } from '../../server/constants/configurations.js';
// const initialPTOFilterConditions = Map({
//     'status': ''
// });

const initialState = Map({
	startDate: ''
});

function setStartDate(state, startDate) {
	return state.set('startDate', startDate);
}

export default function resourceMapReducer(state = initialState, action) {
	var nextState = state;
	switch (action.type){
	case actionTypes.FETCH_RESOURCE_MAP_DATA:
		nextState = setStartDate(nextState, action.startDate);
		return nextState;
	default:
		return nextState;
	}
}