/**
 * @author Howard Chang
 */

import { Map, OrderedMap, List } from 'immutable';

const initialState = Map({
    isLoading: false,
    showAddFolderModal: false,
    showUploadFileModal: false,
    folderModalErrorMessage: '',
    uploadFilesCache: List.of(),
    folders: OrderedMap({
        articles: List.of(
            OrderedMap({
                name: 'ES6 Async Await',
                uploadedTime: '2015/11/12',
                uploadedBy: 'Howard Chang',
                link: 'www.google.com'
            }),
            OrderedMap({
                name: 'Css Tricks',
                uploadedTime: '2015/12/18',
                uploadedBy: 'Howard Chang',
                link: 'www.google.com'
            })
        ),
        tutorials: List.of(
            OrderedMap({
                name: 'RESTful API with GraphQL',
                uploadedTime: '2015/10/3',
                uploadedBy: 'Howard Chang',
                link: 'www.google.com'
            }),
            OrderedMap({
                name: 'Fake file',
                uploadedTime: '2015/1/3',
                uploadedBy: 'Howard Chang',
                link: 'www.google.com'
            })
        )
    })
});

export default function dataExplorer(state = initialState, action) {
    switch (action.type) {
        // Folder View Actions
        case 'TOGGLE_ADD_FOLDER_MODAL':
            return state.update('showAddFolderModal', (originalState) => !originalState);
        case 'ADD_NEW_FOLDER':
            return state.setIn(['folders', action.name], List.of());
        case 'SET_FOLDER_MODAL_ERROR_MESSAGE':
            return state.set('folderModalErrorMessage', action.msg);
        case 'DELETE_FOLDER':
            return state.update('folders', (folders) => folders.delete(action.name));
        // File View Actions
        case 'TOGGLE_UPLOAD_FILE_MODAL':
            return state.update('showUploadFileModal', (originalState) => !originalState);
        case 'CLEAR_UPLOAD_FILES_CACHE':
            return state.set('uploadFilesCache', List.of());
        case 'SET_UPLOAD_FILES_CACHE':
            return state.set('uploadFilesCache', List.of(...action.files));
        default:
            return state;
    }
};
