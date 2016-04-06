/**
 * @author Howard Chang
 */
// Libraries
import { Map, List } from 'immutable';
// Constants
import actionTypes from '../constants/action-types';

const initialState = Map({
    usersWithPrivilege: List.of()
});

export default function adminReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCH_USERS_WITH_PRIVILEGE_SUCCESS:
            return state.set('usersWithPrivilege', action.data);
        default:
            return state;
    }
};
