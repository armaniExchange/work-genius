import * as actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';

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

export function fetchAllCategoriesSuccess(allCategories) {
  return {
    type: actionTypes.FETCH_ALL_CATEGORIES_SUCCESS,
    allCategories
  };
}

export function fetchAllCategories() {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_ALL_CATEGORIES
    });
    let config = {
      method: 'POST',
      body: `{
          allCategories {
            articlesCount,
            id,
            name,
            parentId
          }
      }`,
      headers: {
        'Content-Type': 'application/graphql',
        'x-access-token': localStorage.token
      }
    };

    // fetch categoreis from server
    return fetch(SERVER_API_URL, config)
      .then((res) => res.json())
      .then((body) => {
        dispatch(fetchAllCategoriesSuccess(body.data.allCategories));
      })
      .catch((err) => {
        throw new Error(err);
      });
  };
}

export function fetchAllTagsSuccess(allTags) {
  return {
    type: actionTypes.FETCH_ALL_TAGS_SUCCESS,
    allTags
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
