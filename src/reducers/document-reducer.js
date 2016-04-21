/**
 * @author Steven Fong
 */
// Libraries
import { Map, List, fromJS } from 'immutable';
// Constants
import actionTypes from '../constants/action-types';
import { MENU } from '../constants/menu';

function generateTitleCountMap(articles) {
    let result = {};

    articles.forEach((article) => {
        if (!result[article.categoryId]) {
            result[article.categoryId] = 1;
        } else {
            result[article.categoryId] += 1;
        }
    });

    return result;
}

function getChildren(root, path, titleCountMap) {
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
            childrenCount: Object.keys(titleCountMap).reduce((acc, title) => {
                return title.indexOf(newPath) >= 0 ? acc + titleCountMap[title] : 0;
            }, 0)
        };
    });
}

function enhanceMenu(data, titleCountMap) {
    let path = 'root',
        articlesCount = Object.keys(titleCountMap).reduce((acc, title) => {
            return title.indexOf(path) >= 0 ? acc + titleCountMap[title] : 0;
        }, 0);
    let result = {
        name: 'root',
        isCollapsed: false,
        path,
        children: getChildren(data.root, path, titleCountMap),
        childrenCount: articlesCount
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
  allCategories: Map({}),
  currentSelectedCategory: Map({}),
  allTags: List.of(),
  allUsers: List.of(),
  allMilestones: List.of(),
});

let isFirstTimeFetch = true;

export default function documentReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCH_ARTICLES_SUCCESS:
      if (isFirstTimeFetch) {
        let newTitleCountMap = generateTitleCountMap(action.articleList);
        isFirstTimeFetch = false;
        return state.set('articleList', action.articleList)
          .set('articleTotalCount', action.count)
          .set('allCategories', enhanceMenu(MENU, newTitleCountMap));
      } else {
        return state.set('articleList', action.articleList)
          .set('articleTotalCount', action.count);
      }
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
