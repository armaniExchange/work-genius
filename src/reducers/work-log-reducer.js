// Libraries
import Immutable, { List , OrderedMap } from 'immutable';
// import { appendFileUrlToFiles } from '../libraries/fileUrl';

// Constants
import actionTypes from '../constants/action-types';


const initialState = OrderedMap({
  currentSelectOwner: 'Zhiyou Gao',
  allUsers: List.of(),
  articleList: List.of(),
  articleTotalCount: 0,
  currentPage: 1,
  tags: List.of()
});

export default function workLogReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCH_WORKLOGS_SUCCESS:
      return state.set('articleList', action.articleList)
                  .set('articleTotalCount', action.count);
    case actionTypes.DELETE_WORKLOG_SUCCESS:
      return state.set('articleList', state.get('articleList').filter(article => {
        return article.id !== action.id;
      }));
    case actionTypes.UPDATE_WORKLOGS_QUERY:
      const queryParams = ['owner', 'startDate', 'currentPage'];
      queryParams.forEach((item) => {
        state = state.set(item, typeof action[item] === 'undefined' ? state.get(item) : action[item]);
      });
      return state;
    case actionTypes.FETCH_WORKLOGS_TAG:
      state = state.set('tags', action.tags);
      return state;
    case actionTypes.FETCH_WORKLOGS_LIST:
      state = state.set('articleList', Immutable.fromJS(action.list));
      return state;
    case actionTypes.SET_ALL_USER:
      return state.set('allUsers', Immutable.fromJS(action.users));
    default:
      return state;
  }
};
