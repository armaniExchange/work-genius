// Actions
import * as AppActions from '../actions/app-actions';

export function requireAuth(store) {
	return (nextState, replaceState) => {
		if (!localStorage.token) {
	    	replaceState({ nextPathname: nextState.location.pathname }, '/');
		} else {
			// Use the token to get user information, if token is bad, return to home page as unauthorized
			store.dispatch(AppActions.getCurrentUser(
				(res) => {
					store.dispatch(AppActions.setCurrentUser(res.data.currentUser));
				},
				() => {
					localStorage.removeItem('token');
					location.href = location.origin;
					store.dispatch(AppActions.setCurrentUser({}));
				}
			));
		}
	};
};

export function redirectIfAuthorized(store) {
	return (nextState, replaceState) => {
		if (localStorage.token) {
	    	replaceState({ nextPathname: nextState.location.pathname }, '/main');
		}
		store.dispatch(AppActions.getCurrentUser(
			(res) => {
                store.dispatch(AppActions.setCurrentUser(res.data.currentUser));
			}
		));
	};
};
