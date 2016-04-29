/**
 * @author Steven Fong
 */
// Libraries
import { OrderedMap } from 'immutable';
// Constants
import actionTypes from '../constants/action-types';

const initialState = OrderedMap({
  id: '',
  content: '',
  updatedAt: 0,
});

export default function articleReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCH_DOCUMENT_TEMPLATE_SUCCESS:
      return state.set('id', action.id)
        .set('content', action.content)
        .set('updatedAt', action.updatedAt);
    default:
      return state;
  }
};
