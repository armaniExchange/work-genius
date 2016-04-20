/**
 * @author Steven Fong
 */
// Libraries
import { Map, List } from 'immutable';
// Constants
import actionTypes from '../constants/action-types';
import { MENU } from '../constants/menu';

function getChildren(root, path) {
    if (!root || typeof root !== 'object' || Object.keys(root).length <= 0) {
        return [];
    }
    return Object.keys(root).map((key) => {
        let newPath = `${path}/${key}`;
        return {
            name: key,
            isCollapsed: false,
            path: newPath,
            children: getChildren(root[key], newPath)
        };
    });
}

function enhanceMenu(data) {
    let path = 'root';
    let result = {
        name: 'root',
        isCollapsed: false,
        path,
        children: getChildren(data.root, path)
    };
    return result;
}

const initialState = Map({
  articleList: List.of(),
  articleTotalCount: 0,
  allCategories: Map(enhanceMenu(MENU)),
  allTags: List.of()
});

export default function documentReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCH_ARTICLES_SUCCESS:
      return state.set('articleList', action.articleList)
        .set('articleTotalCount', action.count);
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
