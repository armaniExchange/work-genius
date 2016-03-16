/**
 * @author Steven Fong
 */
// Libraries
import { Map, List } from 'immutable';
// Constants
import * as actionTypes from '../constants/action-types';

const initialState = Map({
  articleList: List.of(),
  categories: List.of(),
  tags: List.of()
});

export default function documentReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCH_ARTICLES_SUCCESS:
      return state.set('articleList', action.articleList);
      break;
    case actionTypes.FETCH_CATEGORIES_SUCCESS:
      return state.set('categories', action.categories);
      break;
    case actionTypes.FETCH_ALL_TAGS_SUCCESS:
      return state.set('tags', action.tags);
      break;
    default:
        return state;
  }
};
