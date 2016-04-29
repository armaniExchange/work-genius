// Libraries
import fetch from 'isomorphic-fetch';
// Constants
import actionTypes from '../constants/action-types';
import { SERVER_SEARCH_API_URL } from '../constants/config';
import { apiFailure } from './app-actions';

/**
* common base code
*/
let searchSuccess = (succType,
  hits, total, size, _from, searchq) => {
  return {
    type: succType,
    hits,
    total,
    size: size,
    from: _from,
    searchq
  };
};
export function searchArticleSuccess(hits, total, size, _from, searchq){
  return searchSuccess(actionTypes.SEARCH_ARTICLE_SUCCESS,
    hits, total, size, _from, searchq);
};
export function searchFileSuccess(hits, total, size, _from, searchq){
  return searchSuccess(actionTypes.SEARCH_FILE_SUCCESS,
    hits, total, size, _from, searchq);
};
export function searchWorklogSuccess(hits, total, size, _from, searchq){
  return searchSuccess(actionTypes.SEARCH_WORKLOG_SUCCESS,
    hits, total, size, _from, searchq);
};
export function searchCommentSuccess(hits, total, size, _from, searchq){
  return searchSuccess(actionTypes.SEARCH_COMMENT_SUCCESS,
    hits, total, size, _from, searchq);
};
export function searchBugtrackingSuccess(hits, total, size, _from, searchq){
  return searchSuccess(actionTypes.SEARCH_BUGTRACKING_SUCCESS,
    hits, total, size, _from, searchq);
};

/**
* common base func
*/
let search = (searchfor, 
  searchq, size, _from) => {
  // searchfor: ARTICLE FILE COMMENT WORKLOG BUGTRACKING
  return (dispatch) => {
    let config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', //<----
        'x-access-token': localStorage.token
      }
    };
    let url = SERVER_SEARCH_API_URL;
    url += `?searchfor=${searchfor}&searchq=${searchq}`;

    if (size!==undefined) {
      url += '&count=' + size;
    }
    if (_from!==undefined) {
      url += '&start=' + _from;
    }
    return fetch(url, config)
      .then((res) => res.json())
      .then((body) => {
        let data = body.data;
        let _hits = data && data.hits || [];
        let _total = data.hasOwnProperty('total') ? data.total : 0;
        let _size = data.hasOwnProperty('size') ? data.size : 0;
        let __from = data.hasOwnProperty('from') ? data.from : 0;
        switch (searchfor) {
          case 'ARTICLE':
          dispatch(searchArticleSuccess(
          _hits, _total, _size, __from, 
          searchq));
          break;
          case 'FILE':
          dispatch(searchFileSuccess(
          _hits, _total, _size, __from, 
          searchq));
          break;
          case 'WORKLOG':
          dispatch(searchWorklogSuccess(
          _hits, _total, _size, __from, 
          searchq));
          break;
          case 'COMMENT':
          dispatch(searchCommentSuccess(
          _hits, _total, _size, __from, 
          searchq));
          break;
          case 'BUGTRACKING':
          dispatch(searchBugtrackingSuccess(
          _hits, _total, _size, __from, 
          searchq));
          break;
        }
      })
      .catch((err) => {
        dispatch(apiFailure(err));
      });
  };
};

export function searchArticle(searchq, size=undefined, _from=undefined) {
  return search('ARTICLE', searchq, size, _from);
};
export function searchFile(searchq, size=undefined, _from=undefined) {
  return search('FILE', searchq, size, _from);
};
export function searchWorklog(searchq, size=undefined, _from=undefined) {
  return search('WORKLOG', searchq, size, _from);
};
export function searchComment(searchq, size=undefined, _from=undefined) {
  return search('COMMENT', searchq, size, _from);
};
export function searchBugtracking(searchq, size=undefined, _from=undefined) {
  return search('BUGTRACKING', searchq, size, _from);
};

export function changeSearchKeyword(newKeyword) {
  return {
    type: actionTypes.CHANGE_SEARCH_KEYWORD,
    newKeyword
  };
};


export function setuppedSearchOnKeyworkChangeAWhile(timerId) {
  return {
    type: actionTypes.SETUPPED_SEARCH_ON_KEYWORD_CHANGE_A_WHILE,
    timerId
  };
};
export function setupSearchOnKeyworkChangeAWhile(func) {
  return (dispatch) => {
    let _timerId = setTimeout(()=>{
      func();
    }, 1500);
    dispatch(setuppedSearchOnKeyworkChangeAWhile(_timerId));
  };
};

export function setSearchBoxNeedShow(needShow) {
  return {
    type: actionTypes.SET_SEARCH_BOX_NEED_SHOW,
    needShow
  };
};
