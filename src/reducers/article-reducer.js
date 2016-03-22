/**
 * @author Steven Fong
 */
// Libraries
import { List , OrderedMap} from 'immutable';
// Constants
import * as actionTypes from '../constants/action-types';

const initialState = OrderedMap({
  // data of article
  id: '',
  title: '',
  author: OrderedMap({
    id: '',
    name: ''
  }),
  tags: List.of(),
  files: List.of(),
  comments: List.of(),
  content: '',
  createdAt: 0,
  updatedAt: 0,
  category: {
    id: '1'
  },
  // data for edit
  allCategories: List.of()
});

export default function editArticleReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.UPDATE_ARTICLE_SUCCESS:
    case actionTypes.FETCH_ARTICLE_SUCCESS:
      return state.set('id', action.id)
        .set('title', action.title)
        .set('author', action.author)
        .set('tags', action.tags)
        .set('files', action.files)
        .set('comments', action.comments)
        .set('content', action.content)
        .set('createdAt', action.createdAt)
        .set('updatedAt', action.updatedAt);
      break;
    case actionTypes.FETCH_ALL_CATEGORIES_WITH_PATH_SUCCESS:
      return state.set('allCategories', action.allCategories);
      break;
    default:
      return state;
  }
};
