// Demo page actions
export const INCREASE_COUNTER = 'INCREASE_COUNTER';
export const DECREASE_COUNTER = 'DECREASE_COUNTER';
export const INCREASE_COUNTER_LATER = 'INCREASE_COUNTER_LATER';

// Main actions
export const SET_LOADING_STATE = 'SET_LOADING_STATE';
export const API_FAILURE = 'API_FAILURE';
export const CLEAR_ERROR_MESSAGE = 'CLEAR_ERROR_MESSAGE';
export const SET_CURRENT_SELECTED_USER_ID = 'SET_CURRENT_SELECTED_USER_ID';

// Task page actions
export const SORT_FEATURE_TABLE_BY_CATEGORY = 'SORT_FEATURE_TABLE_BY_CATEGORY';
export const FILTER_FEATURE_TABLE = 'FILTER_FEATURE_TABLE';
export const RESET_FEATURE_TABLE = 'RESET_FEATURE_TABLE';
export const SORT_BUG_TABLE_BY_CATEGORY = 'SORT_BUG_TABLE_BY_CATEGORY';
export const FILTER_BUG_TABLE = 'FILTER_BUG_TABLE';
export const RESET_BUG_TABLE = 'RESET_BUG_TABLE';
export const FETCH_BUG_REQUEST = 'FETCH_BUG_REQUEST';
export const FETCH_BUG_SUCCESS = 'FETCH_BUG_SUCCESS';
export const FETCH_FEATURE_SUCCESS = 'FETCH_FEATURE_SUCCESS';
export const EDIT_ETA_REQUEST = 'EDIT_ETA_REQUEST';
export const EDIT_ETA_SUCCESS = 'EDIT_ETA_SUCCESS';
export const INITIATE_CRAWLER = 'INITIATE_CRAWLER';
export const FETCH_INTERNAL_FEATURE_SUCCESS = 'FETCH_INTERNAL_FEATURE_SUCCESS';
export const FILTER_INTERNAL_FEATURE_TABLE = 'FILTER_INTERNAL_FEATURE_TABLE';
export const SET_DELETE_WARNING_BOX_STATE = 'SET_DELETE_WARNING_BOX_STATE';
export const SET_SELECTED_ITEM = 'SET_SELECTED_ITEM';
export const RESET_SELECTED_ITEM = 'RESET_SELECTED_ITEM';
export const SET_FEATURE_MODAL_STATE = 'SET_FEATURE_MODAL_STATE';
export const RESET_INTERNAL_FEATURE_TABLE = 'RESET_INTERNAL_FEATURE_TABLE';
export const FETCH_USERS_WITH_TASKS_SUCCESS = 'FETCH_USERS_WITH_TASKS_SUCCESS';

// App actions
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const GET_CURRENT_USER_SUCCESS = 'GET_CURRENT_USER_SUCCESS';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_AUTHENTICATION = 'SET_AUTHENTICATION';
export const LOG_OUT = 'LOG_OUT';

// Data Explorer page actions
export const TOGGLE_ADD_FOLDER_MODAL = 'TOGGLE_ADD_FOLDER_MODAL';
export const ADD_NEW_FOLDER = 'ADD_NEW_FOLDER';
export const SET_FOLDER_MODAL_ERROR_MESSAGE = 'SET_FOLDER_MODAL_ERROR_MESSAGE';
export const DELETE_FOLDER = 'DELETE_FOLDER';
export const TOGGLE_UPLOAD_FILE_MODAL = 'TOGGLE_UPLOAD_FILE_MODAL';
export const CLEAR_UPLOAD_FILES_CACHE = 'CLEAR_UPLOAD_FILES_CACHE';
export const SET_UPLOAD_FILES_CACHE = 'SET_UPLOAD_FILES_CACHE';

//PTO page actions
export const SET_PTO_APPLY_MODAL_STATE = 'SET_PTO_APPLY_MODAL_STATE';
export const FILTER_PTO_TABLE = 'FILTER_PTO_TABLE';
export const SORT_PTO_TABLE_BY_CATEGORY = 'SORT_PTO_TABLE_BY_CATEGORY';
export const FETCH_PTO_APPLICATION_SUCCESS = 'FETCH_PTO_APPLICATION_SUCCESS';
export const FETCH_USERS_WITH_PTO_SUCCESS = 'FETCH_USERS_WITH_PTO_SUCCESS';
export const RESET_PTO_TABLE = 'RESET_PTO_TABLE';
export const DECREASE_YEAR = 'DECREASE_YEAR';
export const INCREASE_YEAR = 'INCREASE_YEAR';

//Admin page actions
export const FETCH_USERS_WITH_PRIVILEGE_SUCCESS = 'FETCH_USERS_WITH_PRIVILEGE_SUCCESS';
export const SET_USER_PRIVILGE = 'SET_USER_PRIVILGE';

// Article actions
export const FETCH_ARTICLE = 'FETCH_ARTICLE';
export const FETCH_ARTICLE_SUCCESS = 'FETCH_ARTICLE_SUCCESS';
export const CREATE_ARTICLE = 'CREATE_ARTICLE';
export const CREATE_ARTICLE_SUCCESS = 'CREATE_ARTICLE_SUCCESS';
export const CREATE_ARTICLE_FAIL = 'CREATE_ARTICLE_FAIL';
export const UPDATE_ARTICLE = 'UPDATE_ARTICLE';
export const UPDATE_ARTICLE_SUCCESS = 'UPDATE_ARTICLE_SUCCESS';
export const UPDATE_ARTICLE_FAIL = 'UPDATE_ARTICLE_FAIL';
export const DELETE_ARTICLE = 'DELETE_ARTICLE';
export const DELETE_ARTICLE_SUCCESS = 'DELETE_ARTICLE_SUCCESS';
export const DELETE_ARTICLE_FAIL = 'DELETE_ARTICLE_FAIL';
export const UPLOAD_ARTICLE_FILE = 'UPLOAD_ARTICLE_FILE';
export const UPLOAD_ARTICLE_FILE_SUCCESS = 'UPLOAD_ARTICLE_FILE_SUCCESS';
export const UPLOAD_ARTICLE_FILE_FAIL = 'UPLOAD_ARTICLE_FILE_FAIL';
export const REMOVE_ARTICLE_FILE = 'REMOVE_ARTICLE_FILE';
export const REMOVE_ARTICLE_FILE_SUCCESS = 'REMOVE_ARTICLE_FILE_SUCCESS';
export const REMOVE_ARTICLE_FILE_FAIL = 'REMOVE_ARTICLE_FILE_FAIL';

// Document page actions
export const FETCH_ARTICLES = 'FETCH_ARTICLES';
export const FETCH_ARTICLES_SUCCESS = 'FETCH_ARTICLES_SUCCESS';
export const FETCH_ARTICLES_FAIL = 'FETCH_ARTICLES_FAIL';
export const FETCH_ALL_CATEGORIES = 'FETCH_ALL_CATEGORIES';
export const FETCH_ALL_CATEGORIES_SUCCESS = 'FETCH_ALL_CATEGORIES_SUCCESS';
export const FETCH_ALL_CATEGORIES_FAIL = 'FETCH_ALL_CATEGORIES_FAIL';
export const FETCH_ALL_TAGS = 'FETCH_ALL_TAGS';
export const FETCH_ALL_TAGS_SUCCESS = 'FETCH_ALL_TAGS_SUCCESS';
export const FETCH_ALL_TAGS_FAIL = 'FETCH_ALL_TAGS_FAIL';

// Feature analysis page actions
export const FETCH_ASSIGNMENT_CATEGORIES = 'FETCH_ASSIGNMENT_CATEGORIES';
export const FETCH_ASSIGNMENT_CATEGORIES_SUCCESS = 'FETCH_ASSIGNMENT_CATEGORIES_SUCCESS';
export const FETCH_ASSIGNMENT_CATEGORIES_FAIL = 'FETCH_ASSIGNMENT_CATEGORIES_FAIL';
export const SET_FORM_VISIBILITY = 'SET_FORM_VISIBILITY';
export const SET_CURRENT_LEAF_NODE = 'SET_CURRENT_LEAF_NODE';

//Bug Review page actions
export const FETCH_BUG_REVIEW_APPLICATION_SUCCESS = 'FETCH_BUG_REVIEW_APPLICATION_SUCCESS';
export const FETCH_BUG_REVIEW_CHANGE_OPTIONS_SUCCESS = 'FETCH_BUG_REVIEW_CHANGE_OPTIONS_SUCCESS';
export const FETCH_BUG_REVIEW_PREVENT_TAGS_OPTIONS = 'FETCH_BUG_REVIEW_PREVENT_TAGS_OPTIONS';
export const FETCH_BUG_REVIEW_ALL_USERS = 'FETCH_BUG_REVIEW_ALL_USERS';
export const SET_BUG_REVIEW_PROJECT_VERSION = 'SET_BUG_REVIEW_PROJECT_VERSION';
export const SET_BUG_REVIEW_SELECT_USER = 'SET_BUG_REVIEW_SELECT_USER';
export const SET_BUG_REVIEW_SELECT_MENU = 'SET_BUG_REVIEW_SELECT_MENU';
export const SET_BUG_REVIEW_SELECT_PREVENT_TAG = 'SET_BUG_REVIEW_SELECT_PREVENT_TAG';
export const SET_BUG_REVIEW_SELECT_ROOT_CAUSE = 'SET_BUG_REVIEW_SELECT_ROOT_CAUSE';
export const FETCH_BUG_REVIEW_ADD_OPTIONS_SUCCESS = 'FETCH_BUG_REVIEW_ADD_OPTIONS_SUCCESS';
