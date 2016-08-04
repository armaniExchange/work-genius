// Immutable
import { Map, List } from 'immutable';
// Constants
import actionTypes from '../constants/action-types';

const initialState = Map({
	navHeaderTitle: 'WG',
	navItems: List.of(
    Map({
        displayText: 'Home',
        link: '/main/'
    }),
    Map({
        displayText: 'Knowledge',
        link: '/main/knowledge/document'
    }),
		Map({
      displayText: 'Resources',
      link: '/main/resource/resource-map'
    }),
    Map({
        displayText: 'Bug Analysis',
        link: '/main/bug-analysis/bug-analysis'
    }),
    Map({
        displayText: 'Page Assignment',
        link: '/main/feature-analysis'
    }),
    Map({
      displayText: 'PTO',
      link: '/main/pto'
    }),
    Map({
      displayText: 'Automation',
      link: '/main/automation'
    }),
	),
	subMenu: Map({
    'Home': List.of(
      {
        name: 'Resource Map',
        url: '/main/resource/resource-map'
      },
      {
        name: 'Device',
        url: '/main/resource/device'
      }
    ),
    'Knowledge': List.of(
      {
        name: 'Document',
        url: '/main/knowledge/document'
      },
      {
        name: 'Bug Tracking',
        url: '/main/knowledge/bug-tracking'
      }
    ),
    'Resources': List.of(
      {
        name: 'Resource Map',
        url: '/main/resource/resource-map'
      },
      {
        name: 'Team Members',
        url: '/main/resource/team'
      },
      {
        name: 'Device',
        url: '/main/resource/device'
      },
      {
        name: 'UT status',
        url: '/main/resource/ut-status'
      }
    ),
    'Bug Analysis': List.of(
      {
        name: 'Root Causes',
        url: '/main/bug-analysis/bug-analysis'
      },
      {
        name: 'Analysis Reports',
        url: '/main/bug-analysis/bug-report'
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
      },
      {
        name: 'Summary',
        url: '/main/pto/summary'
      }
    )
	}),
	currentSelectedPageSubMenu: List.of(),
	hasLogo: true
});

const updateNavigationItem = (state) => {
  return state;
  /*
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
		));*/
};

export default function mainReducer(state = initialState, action) {
	switch (action.type) {
		case actionTypes.GET_CURRENT_USER_SUCCESS:
			return updateNavigationItem(state, action);
		case actionTypes.LOGIN_SUCCESS:
			return updateNavigationItem(state, action);
		case actionTypes.SET_CURRENT_SELECTED_PAGE_NAME:
      let name = action.name;
      if (name === undefined || name === '') {
        name = 'Home';
      }
      let newSubMenu = state.get('subMenu').get(name);
			return state.set('currentSelectedPageSubMenu', newSubMenu ? newSubMenu : List.of());
		default:
			return state;
	}
};
