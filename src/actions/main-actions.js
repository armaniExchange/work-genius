// Constants
import * as actionTypes from '../constants/action-types';

export function setCurrentSelectedUserId(id) {
	return {
		type: actionTypes.SET_CURRENT_SELECTED_USER_ID,
		id
	};
};
