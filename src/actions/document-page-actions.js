import * as actionTypes from '../constants/action-types';


const fakeArticleList = [
  {
    id: '0',
    title: 'first article',
    author: {
      id: '0',
      name: 'fong'
    },
    tags: [
      {id: 1, value: 'tag1'},
      {id: 2, value: 'tag2'}
    ],
    attachments: [],
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
    tags: [
      {id: 1, value: 'tag1'},
      {id: 2, value: 'tag2'}
    ],
    attachments: [],
    comments: [],
    content: '```js\nfunction(){}\n```\n* item 1\n * item 2',
    createdAt: 1457085436639,
    updatedAt: 1457085446639,
  }
];

export function fetchArticlesSuccess(articleList) {
  return {
    type: actionTypes.FETCH_ARTICLES_SUCCESS,
    articleList
  };
}

export function fetchArticles() {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_ARTICLES
    });
    // get data from server
    dispatch(fetchArticlesSuccess(fakeArticleList));
  };
}
