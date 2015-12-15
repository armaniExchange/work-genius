// Immutable
import { Map, List, fromJS } from 'immutable';
// Constants
import * as actionTypes from '../constants/action-types';

const initialState = Map({
	navHeaderTitle: 'WG',
	isLoading: false,
	errorMessage: '',
	navItems: List.of(
		Map({
			displayText: 'Dashboard',
			link: '/main'
		}),
		Map({
			displayText: 'Task',
			link: '/main/task'
		}),
		Map({
			displayText: 'PTO',
			link: '/main/pto'
		}),
		Map({
			displayText: 'Data Explorer',
			link: '/main/data-explorer'
		}),
		Map({
			displayText: 'Redux Demo',
			link: '/main/redux-demo'
		})
	),
	hasLogo: true
});

export default function mainReducer(state = initialState, action) {
	switch (action.type) {
		case actionTypes.SET_LOADING_STATE:
			return state.set('isLoading', action.state);
		case actionTypes.API_FAILURE:
			return state.set('errorMessage', fromJS(action.err));
		case actionTypes.CLEAR_ERROR_MESSAGE:
			return state.set('errorMessage', '');
		default:
			return state;
	}
};
