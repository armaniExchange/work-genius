import * as actionTypes from '../constants/action-types';

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
      tags: [ 'tagA', 'tagB' ],
      files: [],
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

export function updateArticleSuccess(article) {
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
    let article = fakeData[0];
    // update to server
    Object.assign(article, newArticle);
    dispatch(updateArticleSuccess(article));
  };
}

export function uploadArticleFileSuccess(file) {
  return {
    type: actionTypes.UPLOAD_ARTICLE_FILE_SUCCESS,
    file
  };
}

export function uploadArticleFile(file) {
  return dispatch => {
    dispatch({
      type: actionTypes
    });
    dispatch(uploadArticleFileSuccess(file));
  };
}
