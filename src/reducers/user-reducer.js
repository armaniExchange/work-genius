// Libraries
import { Map} from 'immutable';
// Constants
// import * as actionTypes from '../constants/action-types';

const initialState = Map({
	isLoading: false,
	loadingError: undefined,
	bugTableTitle: 'Login'
});


export default function userReducer(state = initialState, action) {
	// console.log(state, action);
	switch (action.type) {

		default:
			// console.log('entered default login state');
			return state;
	}
};
