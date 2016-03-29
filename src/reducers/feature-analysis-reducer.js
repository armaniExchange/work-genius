// import * as actionTypes from '../constants/action-types';
import { Map, List } from 'immutable';
import FEATURE_OPTIONS from './static-feature-options';

const initialState = Map({
	featureOptions: FEATURE_OPTIONS,
    data: List.of(
        Map({
            id: 1
        }),
        Map({
            id: 2
        }),
        Map({
            id: 3
        }),
        Map({
            id: 4
        }),
        Map({
            id: 5
        })
    )
});

export default function featureAnalysisReducer(state = initialState, action) {
	switch (action.type) {
		default:
			return state;
	}
};
