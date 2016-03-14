/**
 * @author Steven Fong
 */
// Libraries
import { List , OrderedMap} from 'immutable';
// Constants
import * as actionTypes from '../constants/action-types';

const initialState = OrderedMap({
    id: '',
    title: '',
    author: OrderedMap({
      id: '0',
      name: 'fong'
    }),
    tags: List.of(),
    attachments: List.of(),
    comments: List.of(),
    content: '',
    createdAt: 0,
    updatedAt: 0,
});

export default function editArticleReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCH_ARTICLE_SUCCESS:
            return state.set('id', action.id)
              .set('title', action.title)
              .set('author', action.author)
              .set('tags', action.tags)
              .set('attachments', action.attachments)
              .set('comments', action.comments)
              .set('content', action.content)
              .set('createdAt', action.createdAt)
              .set('updatedAt', action.updatedAt);
        default:
            return state;
    }
};
