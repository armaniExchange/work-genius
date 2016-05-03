/**
 * @author Steven Fong
 */
// Libraries
import { Map, List, fromJS } from 'immutable';
// Constants
import actionTypes from '../constants/action-types';
import { MENU } from '../constants/menu';
import { TECH_MENU } from '../constants/tec-menu';
import _ from 'lodash';


_.merge(MENU, TECH_MENU);

function countArticles(dataArr, root) {
    let directChildren, subDataArr;
    if (!root || dataArr.length === 0) {
        return  0;
    }
    directChildren = dataArr.filter((node) => { return node.parentId === root.id; });
    subDataArr = dataArr.filter((node) => { return node.parentId !== root.id; });

    if (directChildren.length === 0) {
        return root.articlesCount;
    }
    return directChildren.map((node) => {return countArticles(subDataArr, node);}).reduce((acc, x) => acc + x, 0);
}

function generateTree(dataArr, root, path) {
    let subTree, directChildren, subDataArr;
    if (!root || Object.keys(root).length === 0) {
        return {};
    }
    if (dataArr.length === 0) {
        return {
            id: root.id,
            name: root.name,
            path: root.name === 'root' ? 'root' : `${path}/${root.name}`,
            isCollapsed: root.name === 'root' ? false : true,
            parentId: root.parentId,
            children: [],
            articlesCount: root.articlesCount
        };
    }
    directChildren = dataArr.filter((node) => { return node.parentId === root.id; });
    subDataArr = dataArr.filter((node) => { return node.parentId !== root.id; });
    subTree = directChildren.map((node) => {
        return generateTree(subDataArr, node, root.name === 'root' ? 'root' : `${path}/${root.name}`);
    });
    return {
        id: root.id,
        name: root.name,
        path: root.name === 'root' ? 'root' : `${path}/${root.name}`,
        isCollapsed: root.name === 'root' ? false : true,
        parentId: root.parentId,
        children: subTree,
        articlesCount: countArticles(dataArr, root)
    };
};

function transformToTree(dataArr) {
    let root = dataArr.filter((node) => { return !node.parentId; })[0],
        rest = dataArr.filter((node) => { return node.parentId; });
    return generateTree(rest, root, '');
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
  documentCategoriesLength: 0,
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
      return state.set('documentCategoriesLength', action.data.length).set('documentCategories', fromJS(transformToTree(action.data)));
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
