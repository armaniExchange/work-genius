import * as actionTypes from '../constants/action-types';

export function increaseCounter() {
	return {
		type: actionTypes.INCREASE_COUNTER
	};
}

export function decreaseCounter() {
	return {
		type: actionTypes.DECREASE_COUNTER
	};
}

export function increaseCounterLater() {
	return dispatch => {
		dispatch({
			type: actionTypes.INCREASE_COUNTER_LATER
		});
		setTimeout(() => {
			dispatch(increaseCounter());
		}, 3000);
	};
}