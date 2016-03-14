import * as actionTypes from '../constants/action-types';

export function fetchArticles() {
  return {
    type: actionTypes.FETCH_ARTICLES
  };
}
