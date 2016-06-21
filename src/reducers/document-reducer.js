/**
 * @author Steven Fong
 */
// Libraries
import { Map, List, fromJS } from 'immutable';
import _ from 'lodash';
// Constants
//
import actionTypes from '../constants/action-types';
import { MENU } from '../constants/menu';
import { TECH_MENU } from '../constants/tec-menu';
import {
  sumUpFromChildrenNode,
  generateTree
} from '../libraries/tree';

_.merge(MENU, TECH_MENU);

function transformToTree(dataArr) {
    let root = dataArr.filter((node) => { return !node.parentId; })[0],
        rest = dataArr.filter((node) => { return node.parentId; });
    let tree = generateTree(rest, root, { path: '' }, (node, parent) => {
      return {
        path: node.name === 'root' ? 'root' : `${parent.path}/${node.name}`,
        isCollapsed: node.name === 'root' ? false : true
      };
    });
    sumUpFromChildrenNode(tree, {
      init: { accumCount: 0 },
      siblingMerge(prev, current) {
        return {
          accumCount: prev.accumCount + (current.articlesCount || 0)
        };
      },
      childrenParentMerge(childrenResult, parent) {
        return {
          articlesCount: childrenResult.accumCount + (parent.articlesCount || 0)
        };
      }
    });
    return tree;
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
  documentCategories: Map({}),
  currentSelectedCategory: Map({}),
  allTags: List.of(),
  allUsers: List.of(),
  allMilestones: List.of(),
  // query object
  categoryId: '',
  currentPage: 1,
  tag: '',
  documentType: '',
  priority: '',
  milestone: '',
  owner: ''
});

export default function documentReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCH_ARTICLES_SUCCESS:
      return state.set('articleList', action.articleList).set('articleTotalCount', action.count);
    case actionTypes.FETCH_ALL_TAGS_SUCCESS:
      return state.set('allTags', action.allTags);
    case actionTypes.SET_SELECTED_CATEGORY:
      let updatedTree;
      if (action.data && action.data.isLeaf) {
        return state.set('currentSelectedCategory', action.data);
      } else {
        updatedTree = updateCollpaseStatus(state.get('documentCategories').toJS(), action.data.path);
        return state.set('currentSelectedCategory', action.data).set('documentCategories', fromJS(updatedTree));
      }
    case actionTypes.DELETE_ARTICLE_SUCCESS:
      return state.set('articleList', state.get('articleList').filter(article => {
        return article.id !== action.id;
      }));
    case actionTypes.FETCH_ALL_USERS_SUCCESS:
      return state.set('allUsers', fromJS(action.allUsers));
    case actionTypes.FETCH_DOCUMENT_CATEGORIES_SUCCESS:
      return state.set('documentCategories', fromJS(transformToTree(action.data)));
    case actionTypes.FETCH_ALL_MILESTONES_SUCCESS:
      return state.set('allMilestones', action.allMilestones);
    case actionTypes.UPDATE_ARTICLES_QUERY:
      const queryParams = ['categoryId', 'currentPage', 'tag', 'documentType', 'priority', 'milestone', 'owner'];
      queryParams.forEach((item) => {
        state = state.set(item, typeof action[item] === 'undefined' ? state.get(item) : action[item]);
      });
      return state;
    default:
      return state;
  }
};
