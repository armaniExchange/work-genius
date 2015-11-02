// Libraries
import { Map, List, OrderedMap, fromJS } from 'immutable';
// Constants
import * as actionTypes from '../constants/action-types';

const initialState = Map({
	isLoading: false,
	loadingError: undefined,
	bugsTableOriginalData: List.of(OrderedMap({
		'Developer': '',
		'Title': '',
		'PRI': '',
		'Status': '',
		'Dev (%)': '',
		'QA (%)': '',
		'QA': '',
		'Project': '',
		'ETA': ''
	})),
	bugsTableData: List.of(OrderedMap({
		'Developer': '',
		'Title': '',
		'PRI': '',
		'Status': '',
		'Dev (%)': '',
		'QA (%)': '',
		'QA': '',
		'Project': '',
		'ETA': ''
	})),
	sortBy: List.of(),
	filterConditions: Map({
		'Developer': '',
		'PRI': '',
		'Project': ''
	})
});

function filterOriginal(state) {
	let nextState = state;

	nextState = nextState.update('bugsTableData', () => {
		let keys = nextState.get('filterConditions').keySeq();
		let filteredResult = nextState.get('bugsTableOriginalData').filter((bug) => {
			return keys.reduce((acc, key) => {
				if (bug.get(key) !== nextState.getIn(['filterConditions', key]) && nextState.getIn(['filterConditions', key]) !== '') {
					return acc && false;
				}
				return acc && true;
			}, true);
		});
		return filteredResult.isEmpty() ? List.of(OrderedMap({
			'Developer': '',
			'Title': '',
			'PRI': '',
			'Status': '',
			'Dev (%)': '',
			'QA (%)': '',
			'QA': '',
			'Project': '',
			'ETA': ''
		})) : filteredResult;
	});

	return nextState;
}

function sortAlphaNum(a,b) {
	let reA = /[^a-zA-Z]/g;
	let reN = /[^0-9]/g;
    let aA = a.replace(reA, '');
    let bA = b.replace(reA, '');

    if (aA === bA) {
        let aN = parseInt(a.replace(reN, ''), 10);
        let bN = parseInt(b.replace(reN, ''), 10);
        return aN === bN ? 0 : aN > bN ? 1 : -1;
    }

    return aA > bA ? 1 : -1;
}

function sortOriginal(state) {
	let nextState = state;

	nextState = nextState.update('bugsTableData', (data) => {
		return data.sort((curr, next) => {
			let result = 0;
			nextState.get('sortBy').forEach((category) => {
				let tempResult = sortAlphaNum(curr.get(category), next.get(category));
				if (tempResult !== 0 && result === 0) {
					result = tempResult;
				}
			});
			return result;
		});
	});

	return nextState;
}

function updateKeyName(task) {
	let keyTitleMap = {
		'developer': 'Developer',
		'title': 'Title',
		'pri': 'PRI',
		'status': 'Status',
		'devProgress': 'Dev (%)',
		'qaProgress': 'QA (%)',
		'qa': 'QA',
		'project': 'Project',
		'eta': 'ETA'
	};
	let result = {};

	Object.keys(task).forEach((key) => {
		result[keyTitleMap[key]] = task[key];
	});

	return result;
}

function formatResponse(data) {
	let result = List.of();

	data.forEach((task) => {
		let updatedTask = updateKeyName(task);
		result = result.push(OrderedMap(updatedTask));
	});

	return result;
}

export default function taskReducer(state = initialState, action) {
	let nextState = state;
	switch (action.type) {
		case actionTypes.SORT_BUG_TABLE_BY_CATEGORY:
			let indexToBeDeleted = state.get('sortBy').indexOf(action.category);
			if (indexToBeDeleted === -1) {
				nextState = state.update('sortBy', (categories) => {
					return categories.push(action.category);
				});
			} else {
				nextState = state.update('sortBy', (categories) => {
					return categories.delete(indexToBeDeleted);
				});
			}
			nextState = filterOriginal(nextState);
			nextState = sortOriginal(nextState);
			return nextState;
		case actionTypes.FILTER_BUG_TABLE:
			nextState = nextState.set('filterConditions', Map(action.filterConditions));
			nextState = filterOriginal(nextState);
			nextState = sortOriginal(nextState);
			return nextState;
		case actionTypes.RESET_BUG_TABLE:
			return state
			    .update('bugsTableData', () => {
					return state.get('bugsTableOriginalData');
				})
			    .set('sortBy',
			    	List.of()
			    )
			    .set(
			    	'filterConditions',
			    	Map({
						'Developer': '',
						'PRI': '',
						'Project': ''
					})
				);
		case actionTypes.SET_LOADING_STATE:
			return state.set('isLoading', action.state);
		case actionTypes.FETCH_TASKS_SUCCESS:
			let formatedData = formatResponse(action.data);
			return state
			    .set('isLoading', false)
			    .set('loadingError', undefined)
			    .set('bugsTableOriginalData', formatedData)
			    .set('bugsTableData', formatedData);
		case actionTypes.FETCH_TASKS_FAILURE:
			alert(action.err);
			return state
			    .set('isLoading', false)
			    .set('loadingError', fromJS(action.err));
		default:
			return state;
	}
};
