/**
 * @author Steven Fong
 */
// Libraries
import { List , OrderedMap} from 'immutable';
// Constants
import actionTypes from '../constants/action-types';

const initialState = OrderedMap({
  // data of article
  id: '',
  title: '',
  author: OrderedMap({
    id: '',
    name: ''
  }),
  category: {
    id: ''
  },
  tags: List.of(),
  files: List.of(),
  comments: List.of(),
  content: '',
  createdAt: 0,
  updatedAt: 0,
});

export default function articleReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.UPDATE_ARTICLE_SUCCESS:
    case actionTypes.FETCH_ARTICLE_SUCCESS:
      return state.set('id', action.id)
        .set('title', action.title)
        .set('author', action.author)
        .set('category', action.category)
        .set('tags', action.tags)
        .set('files', action.files)
        .set('comments', action.comments)
        .set('content', action.content)
        .set('createdAt', action.createdAt)
        .set('updatedAt', action.updatedAt);
    case actionTypes.UPLOAD_ARTICLE_FILE_SUCCESS:
      return state.set('files', [...state.get('files'), action.file]);
    case actionTypes.REMOVE_ARTICLE_FILE_SUCCESS:
      return state.set('files', state.get('files').filter(removedFile => {
        return removedFile.id !== action.id;
      }));
    default:
      return state;
  }
};
