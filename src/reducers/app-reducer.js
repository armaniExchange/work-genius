// Immutable
import { Map, fromJS } from 'immutable';
// Constants
import actionTypes from '../constants/action-types';

const initialState = Map({
    token: '',
    isLoading: false,
    errorMessage: '',
    currentUser: Map({}),
    isAuthenticated: undefined,
    loginError: ''
});

export default function appReducer(state = initialState, action) {
    let newUser = null;
    switch (action.type) {
        case actionTypes.LOGIN_SUCCESS:
            newUser = Map(action.user);
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
        case actionTypes.GET_CURRENT_USER_SUCCESS:
            newUser = Map(action.user);
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
        case actionTypes.SET_LOADING_STATE:
            return state.set('isLoading', action.state);
        case actionTypes.API_FAILURE:
            return state.set('errorMessage', fromJS(action.err));
        case actionTypes.CLEAR_ERROR_MESSAGE:
            return state.set('errorMessage', '');
        default:
            return state;
    }
};
