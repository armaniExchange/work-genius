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
			displayText: 'Bug Analysis',
			link: '/main/bug-analysis'
		}),
    Map({
      displayText: 'Bug Report',
      link: '/main/bug-report'
    }),
    Map({
      displayText: 'Document',
      link: '/main/document'
    }),
		Map({
			displayText: 'Redux Demo',
			link: '/main/redux-demo'
		}),
	    Map({
	        displayText: 'Valid Demo',
	        link: '/main/valid-demo'
	    }),
		Map({
	        displayText: 'Page Assignment',
	        link: '/main/feature-analysis'
	    })
	),
	hasLogo: true
});

const updateNavigationItem = (state, action) => {
	return action.user.privilege >= PRIVILEGE.ADMIN ?
		state.update('navItems', (items) => {
			return items.filter(
				item => item.get('displayText') !== 'Admin'
			).unshift(
			    Map({
					displayText: 'Admin',
					link: '/main/admin'
				})
			);
		}) :
		state.update('navItems', (items) => items.filter(
			item => item.get('displayText') !== 'Admin'
		));
};

export default function mainReducer(state = initialState, action) {
	switch (action.type) {
		case actionTypes.GET_CURRENT_USER_SUCCESS:
			return updateNavigationItem(state, action);
		case actionTypes.LOGIN_SUCCESS:
			return updateNavigationItem(state, action);
		default:
			return state;
	}
};
