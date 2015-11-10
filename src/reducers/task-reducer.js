// Libraries
import { Map, List, OrderedMap, fromJS } from 'immutable';
// Constants
import * as actionTypes from '../constants/action-types';

const initialState = Map({
	isLoading: false,
	loadingError: undefined,
	bugTableTitle: 'Bugs',
	bugTableOriginalData: List.of(OrderedMap({
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
	bugTableData: List.of(OrderedMap({
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
	sortBugTableBy: List.of(),
	bugFilterConditions: Map({
		'Developer': '',
		'PRI': '',
		'Project': ''
	}),
	featureTableTitle: 'Features',
	featureTableOriginalData: List.of(OrderedMap({
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
	featureTableData: List.of(OrderedMap({
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
	sortFeatureTableBy: List.of(),
	featureFilterConditions: Map({
		'Developer': '',
		'PRI': '',
		'Project': ''
	}),
});

function filterOriginal(state, type) {
	let nextState = state;
	nextState = nextState.update(`${type}TableData`, () => {
		let keys = nextState.get(`${type}FilterConditions`).keySeq();
		let filteredResult = nextState.get(`${type}TableOriginalData`).filter((bug) => {
			return keys.reduce((acc, key) => {
				if (bug.get(key) !== nextState.getIn([`${type}FilterConditions`, key]) && nextState.getIn([`${type}FilterConditions`, key]) !== '') {
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

function sortOriginal(state, type) {
	let nextState = state;

	nextState = nextState.update(`${type}TableData`, (data) => {
		return data.sort((curr, next) => {
			let result = 0;
			nextState.get(`sort${type[0].toUpperCase()+type.slice(1)}TableBy`).forEach((category) => {
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
		'dev_progress': 'Dev (%)',
		'qa_progress': 'QA (%)',
		'qa': 'QA',
		'project': 'Project',
		'eta': 'ETA'
	};
	let result = {};

	Object.keys(task).forEach((key) => {
		let title = keyTitleMap[key] ? keyTitleMap[key] : '';
		result[title] = task[key];
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

function filterTable(state, filterConditions, type) {
	let nextState = state.set(`${type}FilterConditions`, Map(filterConditions));
	nextState = filterOriginal(nextState, type);
	nextState = sortOriginal(nextState, type);
	return nextState;
}

function setTableData(state, data, type) {
	let formatedData = formatResponse(data);;
	return state
	    .set('isLoading', false)
	    .set('loadingError', undefined)
	    .set(`${type}TableOriginalData`, formatedData)
	    .set(`${type}TableData`, formatedData);
}

function resetTable(state, type) {
	return state
	    .update(`${type}TableData`, () => {
			return state.get(`${type}TableOriginalData`);
		})
	    .set(`sort${type[0].toUpperCase()+type.slice(1)}TableBy`,
	    	List.of()
	    )
	    .set(
	    	`${type}FilterConditions`,
	    	initialState.get(`${type}FilterConditions`)
		);
}

function sortTable(state, newCategory, type) {
	let indexToBeDeleted = state.get(`sort${type[0].toUpperCase()+type.slice(1)}TableBy`).indexOf(newCategory);
	if (indexToBeDeleted === -1) {
		state = state.update(`sort${type[0].toUpperCase()+type.slice(1)}TableBy`, (categories) => {
			return categories.push(newCategory);
		});
	} else {
		state = state.update(`sort${type[0].toUpperCase()+type.slice(1)}TableBy`, (categories) => {
			return categories.delete(indexToBeDeleted);
		});
	}
	state = filterOriginal(state, type);
	state = sortOriginal(state, type);
	return state;
}

export default function taskReducer(state = initialState, action) {
	switch (action.type) {
		case actionTypes.SORT_BUG_TABLE_BY_CATEGORY:
			return sortTable(state, action.category, 'bug');
		case actionTypes.SORT_FEATURE_TABLE_BY_CATEGORY:
			return sortTable(state, action.category, 'feature');
		case actionTypes.FILTER_BUG_TABLE:
			return filterTable(state, action.filterConditions, 'bug');
		case actionTypes.FILTER_FEATURE_TABLE:
			return filterTable(state, action.filterConditions, 'feature');
		case actionTypes.RESET_BUG_TABLE:
			return resetTable(state, 'bug');
		case actionTypes.RESET_FEATURE_TABLE:
			return resetTable(state, 'feature');
		case actionTypes.SET_LOADING_STATE:
			return state.set('isLoading', action.state);
		case actionTypes.FETCH_BUG_SUCCESS:
			return setTableData(state, action.data, 'bug');
		case actionTypes.FETCH_FEATURE_SUCCESS:
			return setTableData(state, action.data, 'feature');
		case actionTypes.FETCH_TASK_FAILURE:
			alert(action.err);
			return state
			    .set('isLoading', false)
			    .set('loadingError', fromJS(action.err));
		default:
			return state;
	}
};
