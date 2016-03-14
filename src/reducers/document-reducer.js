/**
 * @author Steven Fong
 */
// Libraries
import { Map, List , OrderedMap} from 'immutable';
// Constants
import * as actionTypes from '../constants/action-types';

const initialState = Map({
    articleList: List.of(
      OrderedMap({
        id: '0',
        title: 'first article',
        author: OrderedMap({
          id: '0',
          name: 'fong'
        }),
        tags: List.of(
          OrderedMap({id: 1, value: 'tag1'}),
          OrderedMap({id: 2, value: 'tag2'})
        ),
        attachments: List.of(),
        comments: List.of(),
        content: '```js\nfunction(){}\n```\n* item 1\n * item 2',
        createdAt: 1457085436639,
        updatedAt: 1457085446639,
      }),
      OrderedMap({
        id: '0',
        title: 'second article',
        author: OrderedMap({
          id: '1',
          name: 'fong'
        }),
        tags: List.of(
          OrderedMap({id: 1, value: 'tag1'}),
          OrderedMap({id: 2, value: 'tag2'})
        ),
        attachments: List.of(),
        comments: List.of(),
        content: '```js\nfunction(){}\n```\n* item 1\n * item 2',
        createdAt: 1457085436639,
        updatedAt: 1457085446639,
      }),
    )
});

export default function documentReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCH_ARTICLES_SUCCESS:
            return state.set('documentation', action.data);
        default:
            return state;
    }
};
