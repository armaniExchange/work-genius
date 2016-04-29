import actionTypes from '../constants/action-types';
import { Map } from 'immutable';

export const PAGESIZE = 5;

const initialState = Map({
  searchKeyword: '',
  searchBoxNeedShow: undefined,
  searchTimerId: null, //autoDoSearchTimerId after TextField was changed
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

let typeSearchSuccess = (state, action) => {
  const mappingSearchTab = {
    [actionTypes.SEARCH_ARTICLE_SUCCESS]: {tab:'ARTICLE', searchResult: 'articleSearchResult', total:'articleTotal', 'curPage':'articleCurPage'},
    [actionTypes.SEARCH_FILE_SUCCESS]: {tab:'FILE', searchResult: 'fileSearchResult', total:'fileTotal', 'curPage':'fileCurPage'},
    [actionTypes.SEARCH_WORKLOG_SUCCESS]: {tab:'WORKLOG', searchResult: 'worklogSearchResult', total:'worklogTotal', 'curPage':'worklogCurPage'},
    [actionTypes.SEARCH_COMMENT_SUCCESS]: {tab:'COMMENT', searchResult: 'commentSearchResult', total:'commentTotal', 'curPage':'commentCurPage'}
  };
  const _currentSearchTab = mappingSearchTab[action.type] && mappingSearchTab[action.type].tab || '';
  const _searchResult = mappingSearchTab[action.type] && mappingSearchTab[action.type].searchResult || '';
  const _total = mappingSearchTab[action.type] && mappingSearchTab[action.type].total || '';
  const _curPage = mappingSearchTab[action.type] && mappingSearchTab[action.type].curPage || '';
  return state
              .set('searchKeyword', action.searchq)
              .set('currentSearchTab', _currentSearchTab)
              .set(_searchResult, action.hits)
              .set(_total, action.total)
              .set(_curPage, 
                1+(+action.from||0)/PAGESIZE);
};

export default function searchReducer(state = initialState, action) {
  console.warn('action.type', action.type);
  switch (action.type) {
    case actionTypes.SEARCH_ARTICLE_SUCCESS:
    case actionTypes.SEARCH_FILE_SUCCESS:
    case actionTypes.SEARCH_WORKLOG_SUCCESS:
    case actionTypes.SEARCH_COMMENT_SUCCESS:
      return typeSearchSuccess(state, action);
    case actionTypes.CHANGE_SEARCH_KEYWORD:
      return state.set('searchKeyword', action.newKeyword);
    case actionTypes.SETUPPED_SEARCH_ON_KEYWORD_CHANGE_A_WHILE:
      return state.set('searchTimerId', action.timerId);
    case actionTypes.SET_SEARCH_BOX_NEED_SHOW:
      return state.set('searchBoxNeedShow', action.needShow);
  }
  return state;
}
