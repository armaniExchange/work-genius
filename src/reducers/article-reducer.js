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
  isEditing: true
});

export default function articleReducer(state = initialState, action) {
  let files = state.get('files');
  switch (action.type) {
    case actionTypes.CREATE_ARTICLE_SUCCESS:
    case actionTypes.UPDATE_ARTICLE_SUCCESS:
      return state.set('id', action.id)
        .set('title', action.title)
        .set('author', action.author)
        .set('category', action.category)
        .set('tags', action.tags)
        .set('files', action.files)
        .set('comments', action.comments)
        .set('content', action.content)
        .set('createdAt', action.createdAt)
        .set('updatedAt', action.updatedAt)
        .set('isEditing', false);
    case actionTypes.FETCH_ARTICLE_SUCCESS:
      return state.set('id', action.id)
        .set('title', action.title)
        .set('author', OrderedMap(action.author))
        .set('category', OrderedMap(action.category))
        .set('tags', List(action.tags))
        .set('files', fromJS(action.files))
        .set('comments', List(action.comments))
        .set('content', action.content)
        .set('createdAt', action.createdAt)
        .set('updatedAt', action.updatedAt);
    case actionTypes.UPLOAD_ARTICLE_FILE:
      const uploading_file = Object.assign({}, action.file, {isUploading: true});
      return state.set('files', state.get('files').push(fromJS(uploading_file)));

    case actionTypes.UPLOAD_ARTICLE_FILE_PROGRESS:
      return state.set('files', files.update(files.findIndex((item) => {
          return item.tempId === action.tempId;
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
          return item.tempId === action.tempId;
        }), (item) => {
          return item.delete('loaded')
            .delete('total')
            .delete('isUploading')
            .set('url', action.file.url);
      }));
    case actionTypes.REMOVE_ARTICLE_FILE_SUCCESS:
      return state.set('files', files.filter(removedFile => {
        return removedFile.get('id') !== action.id;
      }));
    case actionTypes.CLEAR_ARTICLE:
      return initialState;
    default:
      return state;
  }
};
