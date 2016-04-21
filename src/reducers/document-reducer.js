/**
 * @author Steven Fong
 */
// Libraries
import { Map, List, fromJS } from 'immutable';
// Constants
import actionTypes from '../constants/action-types';
import { MENU } from '../constants/menu';

function getChildrenCount(root) {
    if (!root || typeof root !== 'object' || Object.keys(root).length <= 0) {
        return 0;
    }
    return Object.keys(root).reduce((result, next) => {
        let childs = getChildrenCount(root[next]);
        return result + (childs === 0 ? 1 : childs);
    }, 0);
}

function getChildren(root, path) {
    if (!root || typeof root !== 'object' || Object.keys(root).length <= 0) {
        return [];
    }
    return Object.keys(root).map((key) => {
        let newPath = `${path}/${key}`;
        return {
            name: key,
            isCollapsed: true,
            path: newPath,
            children: getChildren(root[key], newPath),
            childrenCount: getChildrenCount(root[key])
        };
    });
}

function enhanceMenu(data) {
    let path = 'root';
    let result = {
        name: 'root',
        isCollapsed: false,
        path,
        children: getChildren(data.root, path),
        childrenCount: getChildrenCount(data.root)
    };
    return result;
}

function updateCollpaseStatus(root, path) {
    if (root.path === path) {
        return {
            ...root,
            isCollapsed: !root.isCollapsed
        };
    }
    if (!root.children || root.children.length === 0) {
        return root;
    }
    let newChildren = root.children.map((child) => updateCollpaseStatus(child, path));

    return {
        ...root,
        children: newChildren
    };
}

const initialState = Map({
  articleList: List.of(),
  articleTotalCount: 0,
  allCategories: enhanceMenu(MENU),
  currentSelectedCategory: Map({}),
  allTags: List.of(),
  allUsers: List.of(),
  allMilestones: List.of(),
});

export default function documentReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCH_ARTICLES_SUCCESS:
      return state.set('articleList', action.articleList)
        .set('articleTotalCount', action.count);
    case actionTypes.FETCH_ALL_TAGS_SUCCESS:
      return state.set('allTags', action.allTags);
    case actionTypes.SET_SELECTED_CATEGORY:
      let updatedTree;
      if (action.data && action.data.isLeaf) {
        return state.set('currentSelectedCategory', action.data);
      } else {
        updatedTree = updateCollpaseStatus(state.get('allCategories'), action.data.path);
        return state.set('currentSelectedCategory', action.data).set('allCategories', updatedTree);
      }
    case actionTypes.DELETE_ARTICLE_SUCCESS:
      return state.set('articleList', state.get('articleList').filter(article => {
        return article.id !== action.id;
      }));
    case actionTypes.FETCH_ALL_USERS_SUCCESS:
      return state.set('allUsers', fromJS(action.allUsers));
    case actionTypes.FETCH_ALL_MILESTONES_SUCCESS:
      return state.set('allMilestones', action.allMilestones);
    default:
        return state;
  }
};
