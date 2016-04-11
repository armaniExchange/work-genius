// Constants
import actionTypes from '../constants/action-types';

export function setCurrentSelectedUserId(id) {
	return {
		type: actionTypes.SET_CURRENT_SELECTED_USER_ID,
		id
	};
};

export function setCurrentSelectedPageName(name) {
	return {
		type: actionTypes.SET_CURRENT_SELECTED_PAGE_NAME,
		name
	};
};
