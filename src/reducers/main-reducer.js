// Immutable
import { Map, List } from 'immutable';

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
		default:
			return state;
	}
};
