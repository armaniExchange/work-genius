// Libraries
import fetch from 'isomorphic-fetch';
// Constants
import actionTypes from '../constants/action-types';
import { SERVER_SEARCH_API_URL } from '../constants/config';
import { apiFailure } from './app-actions';

export function searchArticleSuccess(hits, total, size, _from, searchq){
  return {
    type: actionTypes.SEARCH_ARTICLE_SUCCESS,
    hits,
    total,
    size: size,
    from: _from,
    searchq
  };
};

export function searchArticle(searchq, size=undefined, _from=undefined) {
  return (dispatch) => {
    let config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', //<----
        'x-access-token': localStorage.token
      }
    };
    let url = SERVER_SEARCH_API_URL;
    url += `?searchfor=ARTICLE&searchq=${searchq}`;

    if (size!==undefined) {
      url += '&count=' + size;
    }
    if (_from!==undefined) {
      url += '&start=' + _from;
    }

    return fetch(url, config)
      .then((res) => res.json())
      .then((body) => {
        console.warn(body);
        let data = body.data;
        dispatch(searchArticleSuccess(
          data.hits, data.total, data.size, data.from, 
          searchq));
      })
      .catch((err) => {
        dispatch(apiFailure(err));
      });
  };
};

// Actions
// import {
//     setLoadingState,
//     apiFailure
// } from './app-actions';
// import { setCurrentSelectedUserId } from './main-actions';
// export function sortFeatureTableByCategory(category) {
//     return {
//         type: actionTypes.SORT_FEATURE_TABLE_BY_CATEGORY,
//         category
//     };
// };
