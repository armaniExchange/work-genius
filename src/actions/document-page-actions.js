import * as actionTypes from '../constants/action-types';


const fakeArticleList = [
  {
    id: '0',
    title: 'first article',
    author: {
      id: '0',
      name: 'fong'
    },
    tags: [ 'tagA', 'tagB' ],
    files: [
      {id: '123', name: 'video', type: 'video/mp4', data: ''},
      {id: '123', name: 'someimage', type: 'image/jpeg', data: ''},
    ],
    comments: [],
    content: '```js\nfunction(){}\n```\n* item 1\n * item 2',
    createdAt: 1457085436639,
    updatedAt: 1457085446639,
  },
  {
    id: '0',
    title: 'second article',
    author:{
      id: '1',
      name: 'fong'
    },
    tags: [ 'tagC', 'tagD' ],
    files: [],
    comments: [],
    content: '```js\nfunction(){}\n```\n* item 1\n * item 2',
    createdAt: 1457085436639,
    updatedAt: 1457085446639,
  }
];

const fakeCategories = [
  {id: '1', name: 'slb'},
  {id: '2', parentId: '1', name: 'WAF'},
  {id: '3', parentId: '1', name: 'GSLB'},
  {id: '4', parentId: '3', name: 'Lorem ipsum dolor sit amet'},
  {id: '5', parentId: '3', name: 'Lorem ipsum dolor sit amet'},
  {id: '6', parentId: '3', name: 'Lorem ipsum dolor sit amet'},
  {id: '7', parentId: '3', name: 'Lorem ipsum dolor sit amet'},
  {id: '8', parentId: '3', name: 'Lorem ipsum dolor sit amet'},
  {id: '9', name: 'DDos'},
  {id: '10', name: 'GSLB'}
];

const fakeAllTags = [
  'tagA',
  'tagB',
  'tagC',
  'tagD'
];

export function fetchArticlesSuccess(articleList) {
  return {
    type: actionTypes.FETCH_ARTICLES_SUCCESS,
    articleList
  };
}

export function fetchArticles(query) {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_ARTICLES
    });
    // get data from server
    if (!query) {
      dispatch(fetchArticlesSuccess(fakeArticleList));
      return;
    }
    let result;
    if (query.tag) {
      result = fakeArticleList.filter((article) => {
        return article.tags.indexOf(query.tag) !== -1;
      });
      dispatch(fetchArticlesSuccess(result));
      return;
    }
    if (query.q) {
      result = fakeArticleList.filter((article) => {
        return article.content.indexOf(query.q) !== -1 || article.author.name.indexOf(query.q) !== -1 || article.title.indexOf(query.q) !== -1;
      });
      dispatch(fetchArticlesSuccess(result));
      return;
    }
  };
}

export function fetchCategoriesSuccess(categories) {
  return {
    type: actionTypes.FETCH_CATEGORIES_SUCCESS,
    categories
  };
}

export function fetchCategories() {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_CATEGORIES
    });
    // fetch categoreis from server
    dispatch(fetchCategoriesSuccess(fakeCategories));
  };
}

export function fetchAllTagsSuccess(tags) {
  return {
    type: actionTypes.FETCH_ALL_TAGS_SUCCESS,
    tags
  };
}

export function fetchAllTags() {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_ALL_TAGS
    });
    // fetch categoreis from server
    dispatch(fetchAllTagsSuccess(fakeAllTags));
  };
}
