// Immutable
import { Map, List } from 'immutable';
// Constants
import * as actionTypes from '../constants/action-types';
import { PRIVILEGE } from '../constants/config.js';

const initialState = Map({
	navHeaderTitle: 'WG',
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
		case actionTypes.GET_CURRENT_USER_SUCCESS:
			return action.user.privilege >= PRIVILEGE.ADMIN ?
				state.update('navItems', (items) => items.unshift(
					Map({
						displayText: 'Admin',
						link: '/main/admin'
					})
				)) :
				state.update('navItems', (items) => items.filter(
					item => item.get('displayText') !== 'Admin'
				));
		case actionTypes.LOGIN_SUCCESS:
			return action.user.privilege >= PRIVILEGE.ADMIN ?
				state.update('navItems', (items) => items.unshift(
					Map({
						displayText: 'Admin',
						link: '/main/admin'
					})
				)) :
				state.update('navItems', (items) => items.filter(
					item => item.get('displayText') !== 'Admin'
				));
		default:
			return state;
	}
};
