import * as actionTypes from '../constants/action-types';
// import _ from 'lodash';

// for development use, delete when database ready
// --- start ---
const fakeData = [
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
      content: '# this is a test \n * 1 \n * 2 \n ```js \nfunction(){\n  console.log("test"); \n}\n ```\n[google link](http://www.google.com)\n<iframe width="560" height="315" src="https://www.youtube.com/embed/Mqr-kjvXsk8" frameborder="0" allowfullscreen></iframe>',
      createdAt: 1457085436639,
      updatedAt: 1457085446639,
  }
];

// --- end---


export function fetchArticleSucess(article) {
  return {
    type: actionTypes.FETCH_ARTICLE_SUCCESS,
    ...article
  };
}

export function fetchArticle(id) {
  console.log(`!!featchArticle: ${id}`);
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_ARTICLE,
      id
    });
    // fetch from server
    // const article = _.findWhere(fakeData, {id});
    const article = fakeData[0];
    dispatch(fetchArticleSucess(article));
  };
}

export function createArticleSuccess(article) {
  return {
    type: actionTypes.UPDATE_ARTICLE_SUCCESS,
    ...article
  };
}

export function createArticle(article) {
  return dispatch => {
    dispatch({
      type: actionTypes.CREATE_ARTICLE,
      ...article
    });
    // post to server
    dispatch(fetchArticleSucess(article));
  };
}

export function updateArticleSuccess(article){
  return {
    type: actionTypes.UPDATE_ARTICLE_SUCCESS,
    ...article
  };
}

export function updateArticle(newArticle) {
  return dispatch => {
    dispatch({
      type: actionTypes.UPDATE_ARTICLE
    });

    // update to server
    let article = _.findWhere(fakeData, {id: newArticle.id});
    Object.assign(article, newArticle);
    dispatch(updateArticleSuccess(article));
  };
}
