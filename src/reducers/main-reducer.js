// Immutable
import { Map, List } from 'immutable';
// Constants
import actionTypes from '../constants/action-types';
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
	      displayText: 'Resource Map',
	      link: '/main/resource-map'
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
	subMenu: Map({
		'Dashboard': List.of(),
		'Page Assignment': List.of(
			{
				name: 'Tree View',
				url: '/main/feature-analysis'
			},
		    {
				name: 'Table View',
				url: '/main/feature-analysis/table'
			}
		)
	}),
	currentSelectedPageSubMenu: List.of(),
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
		case actionTypes.SET_CURRENT_SELECTED_PAGE_NAME:
		    let newSubMenu = state.get('subMenu').get(action.name);
			return state.set('currentSelectedPageSubMenu', newSubMenu ? newSubMenu : List.of());
		default:
			return state;
	}
};
