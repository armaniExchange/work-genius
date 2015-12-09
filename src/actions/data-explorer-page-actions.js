// Constant
import * as actionTypes from '../constants/action-types';
// Actions
import * as mainActions from './main-actions';

// Folder View Actions
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

// File View Actions
export function toggleUploadFileModal() {
	return {
		type: actionTypes.TOGGLE_UPLOAD_FILE_MODAL
	};
};

export function saveFilesToUploadCache(files) {
	return {
		type: actionTypes.SET_UPLOAD_FILES_CACHE,
		files
	};
};

export function clearUploadCache() {
	return {
		type: actionTypes.CLEAR_UPLOAD_FILES_CACHE
	};
};

export function uploadFile(file) {
	console.log(file);
	return (dispatch) => {
		dispatch(mainActions.setLoadingState(true));
		dispatch(mainActions.setLoadingState(false));
	};
};