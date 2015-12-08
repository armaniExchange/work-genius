import * as actionTypes from '../constants/action-types';

export function toggleAddFolderModal() {
	return {
		type: actionTypes.TOGGLE_ADD_FOLDER_MODAL
	};
};

export function addNewFolder(name) {
	return {
		type: actionTypes.ADD_NEW_FOLDER,
		name
	};
};

export function setFolderModalErrorMessage(msg) {
	return {
		type: actionTypes.SET_FOLDER_MODAL_ERROR_MESSAGE,
		msg
	};
};

export function deleteFolder(name) {
	return {
		type: actionTypes.DELETE_FOLDER,
		name
	};
};