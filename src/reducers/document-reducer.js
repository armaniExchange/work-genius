/**
 * @author Steven Fong
 */
// Libraries
import { Map, List } from 'immutable';
// Constants
import * as actionTypes from '../constants/action-types';

const initialState = Map({
    articleList: List.of()
});

export default function documentReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCH_ARTICLES_SUCCESS:
            return state.set('articleList', action.articleList);
        default:
            return state;
    }
};
