/**
 * @author Steven Fong
 */
// Libraries
import { Map, List } from 'immutable';
// Constants
import actionTypes from '../constants/action-types';

const initialState = Map({
  articleList: List.of(),
  allCategories: List.of(),
  allTags: List.of()
});

export default function documentReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCH_ARTICLES_SUCCESS:
      return state.set('articleList', action.articleList);
    case actionTypes.FETCH_ALL_CATEGORIES_SUCCESS:
      return state.set('allCategories', action.allCategories);
    case actionTypes.FETCH_ALL_TAGS_SUCCESS:
      return state.set('allTags', action.allTags);
    case actionTypes.DELETE_ARTICLE_SUCCESS:
      return state.set('articleList', state.get('articleList').filter(article => {
        return article.id !== action.id;
      }));
    default:
        return state;
  }
};
