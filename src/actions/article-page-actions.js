import * as actionTypes from '../constants/action-types';

// for development use, delete when database ready
// --- start ---
const fakeArticles = [
  {
      id: '0',
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
      comments: [],
      category: {id: '1'},
      content: '# this is a test123 \n * 1 \n * 2 \n ```js \nfunction(){\n  console.log("test"); \n}\n ```\n[github link](http://www.github.com)\n## iframe\n<iframe width="560" height="315" src="http://www.w3schools.com/" frameborder="0" ></iframe>',
      createdAt: 1457085436639,
      updatedAt: 1457085446639,
  }
];

const fakeAllCategories = [
  {id: '1', name: 'slb', articlesCount: 3, path: 'slb'},
  {id: '2', parentId: '1', name: 'WAF', articlesCount: 30, path: 'slb/WAF'},
  {id: '3', parentId: '1', name: 'GSLB', articlesCount: 10, path: 'slb/GSLB'},
  {id: '4', parentId: '3', name: 'itemA', articlesCount: 20, path: 'slb/GSLB/itemA'},
  {id: '5', parentId: '3', name: 'itemB', articlesCount: 10, path: 'slb/GSLB/itemB'},
  {id: '6', parentId: '3', name: 'itemC', articlesCount: 30, path: 'slb/GSLB/itemC'},
  {id: '7', parentId: '3', name: 'itemD', articlesCount: 40, path: 'slb/GSLB/itemD'},
  {id: '8', parentId: '3', name: 'itemE', articlesCount: 10, path: 'slb/GSLB/itemE'},
  {id: '9', name: 'DDos', articlesCount: 10, path: 'DDos'},
  {id: '10', name: 'GSLB', articlesCount: 10, path: 'GSLB'}
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

export function fetchAllCategoriesWithPathSuccess(allCategories) {
  return {
    type: actionTypes.FETCH_ALL_CATEGORIES_WITH_PATH_SUCCESS,
    allCategories
  };
}

export function fetchAllCategoriesWithPath() {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_ALL_CATEGORIES_WITH_PATH
    });
    // fetch from server
    dispatch(fetchAllCategoriesWithPathSuccess(fakeAllCategories));
  };
}
