// Immutable
import { Map, List } from 'immutable';
// Constants
import actionTypes from '../constants/action-types';
import { PRIVILEGE } from '../constants/config.js';

const initialState = Map({
	navHeaderTitle: 'WG',
	navItems: List.of(
    Map({
        displayText: 'Knowledge',
        link: '/main/knowledge/document'
    }),
		Map({
      displayText: 'Resources',
      link: '/main/resource-map' //new
    }),
    Map({
        displayText: 'Bug Analysis',
        link: '/main/bug-analysis'
    }),
    Map({
        displayText: 'Page Assignment',
        link: '/main/feature-analysis'
    }),
    Map({
      displayText: 'PTO',
      link: '/main/pto'
    }),
	),
	subMenu: Map({
    'Knowledge': List.of(
      {
        name: 'Document',
        url: '/main/knowledge/document'
      },
      {
        name: 'Bug Tracking',
        url: '/main/knowledge/bug-tracking' //new
      }
    ),
    'Resources': List.of(
      {
        name: 'Resource Map',
        url: '/main/resource-map' //new
      }
    ),
    'Reporting': List.of(
      {
        displayText: 'Bug Analysis',
        link: '/main/bug-analysis'
      },
      {
        displayText: 'Bug Report',
        link: '/main/bug-report'
      }
    ),
		'Page Assignment': List.of(
			{
				name: 'Tree View',
				url: '/main/feature-analysis'
			},
		    {
				name: 'Table View',
				url: '/main/feature-analysis/table'
			}
		),
    'PTO': List.of(
      {
        name: 'Apply',
        url: '/main/pto'
      },
      {
        name: 'Overtime',
        url: '/main/pto/overtime'
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
