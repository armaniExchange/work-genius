// Constants
import * as actionTypes from '../constants/action-types';

export function setLoadingState(state) {
	return {
		type: actionTypes.SET_LOADING_STATE,
		state
	};
};

export function apiFailure(err) {
	let msg = err.message ? err.message : err;
	return (dispatch) => {
		dispatch(setLoadingState(false));
		dispatch({
			type: actionTypes.API_FAILURE,
			err : msg
		});
	};
};

export function clearErrorMessage() {
	return {
		type: actionTypes.CLEAR_ERROR_MESSAGE
	};
};

export function setCurrentSelectedUserId(id) {
	return {
		type: actionTypes.SET_CURRENT_SELECTED_USER_ID,
		id
	};
};
