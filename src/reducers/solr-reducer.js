

import { Map, List } from 'immutable';

const initialState = Map({
    searchItems: List.of(
        'Search Key No 1.',
        'Search Key No 2.',
        'Search Key No 3.',
        'Search Key No 4.',
        'Search Key No 5.'
    )
});

const searchResultItems = (state, action) => {
    console.log(action);
    return state.set('searchItems', List.of(
        'Search Key No 6.',
        'Search Key No 7.',
        'Search Key No 8.',
        'Search Key No 9.',
        'Search Key No 10.'
    ));
};

export default function serachReducer(state = initialState, action) {
    switch (action.type) {
        case 'search':
            return searchResultItems(state, action);
        default:
            return state;
    }
};