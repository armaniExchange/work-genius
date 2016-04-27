import actionTypes from '../constants/action-types';
import { Map, List } from 'immutable';

export const PAGESIZE = 3;

const initialState = Map({
  searchKeyword: '',
  currentSearchTab: '',
  pagesize: PAGESIZE,

  articleSearchResult: [],
  articleTotal: 0,
  articleCurPage: 1,
  fileSearchResult: [],
  fileTotal: 0,
  fileCurPage: 1,
  worklogSearchResult: [],
  worklogTotal: 0,
  worklogCurPage: 1,
  commentSearchResult: [],
  commentTotal: 0,
  commentCurPage: 1
});


export default function searchReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SEARCH_ARTICLE_SUCCESS:
      return state
              .set('searchKeyword', action.searchq)
              .set('currentSearchTab', 'ARTICLE')
              .set('articleSearchResult', action.hits)
              .set('articleTotal', action.total)
              .set('articleCurPage', 
                1+(action.from||0)/PAGESIZE);
    break;
  }
  return state;
}
