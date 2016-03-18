import * as actionTypes from '../constants/action-types';


const fakeArticleList = [
  {
    id: '1',
    title: 'first article',
    author: {
      id: '0',
      name: 'fong'
    },
    tags: [ 'tagA', 'tagB' ],
    files: [
      {id: '1', name: 'video', type: 'video/mp4', data: ''},
      {id: '2', name: 'someimage', type: 'image/jpeg', data: ''},
    ],
    category: {
      id: '1'
    },
    comments: [],
    content: '```js\nfunction(){\n  var test = 123;\n  console.log(test)\n}\n```\n* item 1\n * item 2',
    createdAt: 1457085436639,
    updatedAt: 1457085446639,
  },
  {
    id: '2',
    title: 'second article',
    author:{
      id: '1',
      name: 'fong'
    },
    tags: [ 'tagC', 'tagD' ],
    category: {
      id: '2'
    },
    files: [],
    comments: [],
    content: '```js\nfunction(){}\n```\n* item 1\n * item 2',
    createdAt: 1457085436639,
    updatedAt: 1457085446639,
  }
];

const fakeCategories = [
  {id: '1', name: 'slb', articlesCount: 3},
  {id: '2', parentId: '1', name: 'WAF', articlesCount: 30},
  {id: '3', parentId: '1', name: 'GSLB', articlesCount: 10},
  {id: '4', parentId: '3', name: 'Lorem ipsum dolor sit amet', articlesCount: 20},
  {id: '5', parentId: '3', name: 'Lorem ipsum dolor sit amet', articlesCount: 10},
  {id: '6', parentId: '3', name: 'Lorem ipsum dolor sit amet', articlesCount: 30},
  {id: '7', parentId: '3', name: 'Lorem ipsum dolor sit amet', articlesCount: 40},
  {id: '8', parentId: '3', name: 'Lorem ipsum dolor sit amet', articlesCount: 10},
  {id: '9', name: 'DDos', articlesCount: 10},
  {id: '10', name: 'GSLB', articlesCount: 10}
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
