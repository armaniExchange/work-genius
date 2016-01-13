// Immutable
import { Map } from 'immutable';
// Constants
import * as actionTypes from '../constants/action-types';

const initialState = Map({
	token: '',
	currentUser: Map({}),
	loginError: ''
});

export default function appReducer(state = initialState, action) {
	switch (action.type) {
		case actionTypes.SET_TOKEN:
			if (action.token) {
				localStorage.token = action.token;
			} else {
				delete localStorage.token;
			}
		    return state.set('token', action.token).set('loginError', '');
		case actionTypes.SET_CURRENT_USER:
			if (action.user) {
				let newUser = Map(action.user);
				state = state.set('currentUser', newUser);
			} else {
				state = state.set('currentUser', Map({}));
			}
		    return state.set('loginError', '');
		case actionTypes.LOGIN_FAILURE:
		    return state.set('token', '').set('currentUser', Map({})).set('loginError', action.error);
		default:
			return state;
	}
};
