// Immutable
import { Map } from 'immutable';
// Constants
import * as actionTypes from '../constants/action-types';

const initialState = Map({
	token: '',
	currentUser: Map({}),
	isAuthenticated: undefined,
	loginError: ''
});

export default function appReducer(state = initialState, action) {
	switch (action.type) {
	    case actionTypes.LOGIN_SUCCESS:
	    	let newUser = Map(action.user);
	    	if (action.token) {
				localStorage.token = action.token;
			} else {
				localStorage.removeItem('token');
			}
		    return state
		                .set('token', action.token)
		                .set('isAuthenticated', action.isAuthenticated)
		                .set('currentUser', newUser)
		                .set('loginError', '');
		case actionTypes.LOGIN_FAILURE:
			localStorage.removeItem('token');
		    return state
		                .set('token', '')
		                .set('isAuthenticated', false)
		                .set('currentUser', Map({}))
		                .set('loginError', action.error);
		case actionTypes.LOG_OUT:
			localStorage.removeItem('token');
		    return state
		                .set('token', '')
		                .set('isAuthenticated', false)
		                .set('currentUser', Map({}));
		default:
			return state;
	}
};
