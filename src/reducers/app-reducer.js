import { Map, List } from 'immutable';

const initialState = Map({
	navHeaderTitle: 'WG',
	navItems: List.of(
		Map({
			displayText: 'Dashboard',
			link: '/'
		}),
		Map({
			displayText: 'Task',
			link: '/task'
		}),
		Map({
			displayText: 'PTO',
			link: '/pto'
		}),
		Map({
			displayText: 'Redux Demo',
			link: '/redux-demo'
		}),
	),
	hasLogo: true
});

export default function appReducer(state = initialState, action) {
	switch (action.type) {
		default:
			return state;
	}
};
