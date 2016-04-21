/**
 * @author Steven Fong
 */
// Libraries
import { List , OrderedMap, fromJS} from 'immutable';
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
  category: OrderedMap({
    id: ''
  }),
  tags: List(),
  files: List(),
  comments: List(),
  content: '',
  createdAt: 0,
  updatedAt: 0,
  isEditing: true,
  isDeleting: false,
});

export default function articleReducer(state = initialState, action) {
  let files = state.get('files');
  let comments = state.get('comments');

  switch (action.type) {
    case actionTypes.CREATE_ARTICLE_SUCCESS:
    case actionTypes.UPDATE_ARTICLE_SUCCESS:
      return state.set('id', action.id)
        .set('title', action.title)
        .set('author', OrderedMap(action.author))
        .set('category', OrderedMap(action.category))
        .set('tags', List(action.tags || []))
        .set('files', fromJS(action.files || []))
        .set('comments', fromJS(action.comments || []))
        .set('content', action.content)
        .set('createdAt', action.createdAt)
        .set('updatedAt', action.updatedAt)
        .set('isEditing', false);
    case actionTypes.FETCH_ARTICLE_SUCCESS:
      return state.set('id', action.id)
        .set('title', action.title)
        .set('author', OrderedMap(action.author))
        .set('category', OrderedMap(action.category))
        .set('tags', fromJS(action.tags || []))
        .set('files', fromJS(action.files || []))
        .set('comments', fromJS(action.comments || []))
        .set('content', action.content)
        .set('createdAt', action.createdAt)
        .set('updatedAt', action.updatedAt);
    case actionTypes.DELETE_ARTICLE:
      return state.set('isDeleting', true);
    case actionTypes.DELETE_ARTICLE_SUCCESS:
      return state.set('isDeleting', false);
    case actionTypes.UPLOAD_ARTICLE_FILE:
      const uploading_file = Object.assign({}, action.file, {isUploading: true});
      return state.set('files', files.push(fromJS(uploading_file)));
    case actionTypes.UPLOAD_ARTICLE_FILE_PROGRESS:
      return state.set('files', files.update(files.findIndex((item) => {
          return item.get('tempId') === action.tempId;
        }), (item) => {
          const {
            loaded,
            total
          } = action.event;
          return item.set('loaded', loaded)
            .set('total', total);
      }));

    case actionTypes.UPLOAD_ARTICLE_FILE_SUCCESS:
      return state.set('files', files.update(files.findIndex((item) => {
          return item.get('tempId') === action.tempId;
        }), (item) => {
          return item.delete('loaded')
            .delete('tempId')
            .delete('total')
            .delete('isUploading')
            .set('url', action.file.url)
            .set('id', action.file.id);
      }));
    case actionTypes.REMOVE_ARTICLE_FILE_SUCCESS:
      return state.set('files', files.filter(removedFile => {
        return removedFile.get('id') !== action.id;
      }));
    case actionTypes.CREATE_COMMENT_SUCCESS:
      return state.set('comments', comments.push(fromJS(action.comment)));
    case actionTypes.DELETE_COMMENT_SUCCESS:
      return state.set('comments', comments.filter(removedComment => {
        return removedComment.get('id') !== action.id;
      }));
    case actionTypes.CLEAR_ARTICLE:
      return initialState;
    default:
      return state;
  }
};
