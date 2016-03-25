import * as actionTypes from '../constants/action-types';

// for development use, delete when database ready
// --- start ---
const fakeArticles = [
  {
      id: '0',
      title: 'third article',
      author: {
        id: '0',
        name: 'fong'
      },
      tags: [ 'tagA', 'tagB' ],
      files: [
        {id: '1', name: 'video', type: 'video/mp4', data: ''},
        {id: '2', name: 'someimage', type: 'image/jpeg', data: ''},
      ],
      comments: [],
      category: {id: '5706fecf-7915-48c4-aa60-0dd0fb709c9b'},
      content: '# this is a test123 \n * 1 \n * 2 \n ```js \nfunction(){\n  console.log("test"); \n}\n ```\n[github link](http://www.github.com)\n## iframe\n<iframe width="560" height="315" src="http://www.w3schools.com/" frameborder="0" ></iframe>',
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
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_ARTICLE,
      id
    });
    // fetch from server
    const article = fakeArticles[0];
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
    let article = fakeArticles[0];
    // update to server
    Object.assign(article, newArticle);
    dispatch(updateArticleSuccess(article));
  };
}

export function deleteArticleSuccess(articleId) {
  return {
    type: actionTypes.DELETE_ARTICLE_SUCCESS,
    id: articleId
  };
}

export function deleteArticle(articleId) {
  return dispatch => {
    dispatch({
      type: actionTypes.DELETE_ARTICLE
    });
    // update to server
    dispatch(deleteArticleSuccess(articleId));
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
      type: actionTypes.UPLOAD_ARTICLE_FILE
    });
    // server response with true id and file detailed without data
    dispatch(uploadArticleFileSuccess(Object.assign({}, file, {id: file.name})));
  };
}

export function removeArticleFileSuccess(fileId) {
  return {
    type: actionTypes.REMOVE_ARTICLE_FILE_SUCCESS,
    id: fileId
  };
}

export function removeArticleFile(fileId) {
  return dispatch => {
    dispatch({
      type: actionTypes.REMOVE_ARTICLE_FILE,
      id: fileId
    });
    dispatch(removeArticleFileSuccess(fileId));
  };
}
