
import { Map, List } from 'immutable';
// Constants
import actionTypes from '../constants/action-types';
import moment from 'moment';
// import { ADMIN_ID } from '../../server/constants/configurations.js';
// const initialPTOFilterConditions = Map({
//     'status': ''
// });
const initialState = Map({
	startDate: moment().isoWeekday(0).format('YYYY-MM-DD'),
	totalDays: 10,
	data: List.of(
		Map({'name': 'Ruiz', 'items': List.of(
			Map({'item': Map({ 'type': '1', 'date': '1' }) }),
			Map({'item': Map({ 'type': 'log', 'date': 21234, id: '', missions: List.of() }) }),
			Map({'item': Map({ 'type': 'pto', 'date': 21234, id: ''}) }),
			Map({'item': null}),
			Map({'item': null}),
			Map({'item': null}),
			Map({'item': null}),
			Map({'item': null}),
			Map({'item': null}),
			Map({'item': null})
		)})
	),
	show: false
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
	case actionTypes.FETCH_RESOURCE_MAP_MODAL:
		nextState = nextState.set('show', action.show);
		return nextState;
	default:
		return nextState;
	}
}