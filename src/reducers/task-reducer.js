/**
 * @author Howard Chang
 */

// Libraries
import { Map, List, OrderedMap, is } from 'immutable';
// Constants
import * as actionTypes from '../constants/action-types';
import { ADMIN_ID } from '../../server/constants/configurations.js';

const initialBugFilterConditions = Map({
	'project': ''
});

const initialFeatureFilterConditions = Map({
	'project': ''
});

const initialInternalFeatureFilterConditions = Map({
	'project': ''
});

const initialState = Map({
	bugTitleKeyMap: List.of(
		Map({ title: 'ID', key: 'id'}),
		Map({ title: 'Title', key: 'title'}),
		Map({ title: 'ETA', key: 'eta'}),
		Map({ title: 'Created', key: 'created'}),
		Map({ title: 'PRI', key: 'pri'}),
		Map({ title: 'Severity', key: 'severity'}),
		Map({ title: 'Status', key: 'status'}),
		Map({ title: 'Developer', key: 'developer_email'}),
		Map({ title: 'QA', key: 'qa_email'}),
		Map({ title: 'Project', key: 'project'})
	),
	bugTableTitle: 'Bugs',
	bugTableOriginalData: List.of(),
	bugTableData: List.of(),
	sortBugTableBy: Map({
		category: '',
		status: 0
	}),
	bugFilterConditions: initialBugFilterConditions,
	featureTitleKeyMap: List.of(
		Map({ title: 'ID', key: 'id'}),
		Map({ title: 'Title', key: 'title'}),
		Map({ title: 'Status', key: 'status'}),
		Map({ title: '%', key: 'total_percent'}),
		Map({ title: 'Dev %', key: 'dev_percent'}),
		Map({ title: 'QA %', key: 'qa_percent'}),
		Map({ title: 'Duration (days)', key: 'days_to_complete'}),
		Map({ title: 'Complete Date', key: 'completed_date'}),
		Map({ title: 'Owner', key: 'owner_name'}),
		Map({ title: 'Developer', key: 'dev_name'}),
		Map({ title: 'QA', key: 'qa_name'}),
		Map({ title: 'Project', key: 'project'})
	),
	featureTableTitle: 'Features',
	featureTableOriginalData: List.of(),
	featureTableData: List.of(),
	sortFeatureTableBy: Map({
		category: '',
		status: 0
	}),
	featureFilterConditions: initialFeatureFilterConditions,
	internalFeatureTitleKeyMap: List.of(
		Map({ title: 'Title', key: 'title'}),
		Map({ title: 'PRI', key: 'pri'}),
		Map({ title: 'Dev %', key: 'dev_percent'}),
		Map({ title: 'Developer', key: 'dev_name'}),
		Map({ title: 'Assignee', key: 'owner_name'}),
		Map({ title: 'Project', key: 'project'}),
		Map({ title: 'ETA', key: 'eta'}),
		Map({ title: 'Actions', key: 'id'})
	),
	internalFeatureTableTitle: 'Internal Features',
	internalFeatureTableOriginalData: List.of(),
	internalFeatureTableData: List.of(),
	sortInternalFeatureTableBy: Map({
		category: '',
		status: 0
	}),
	internalFeatureFilterConditions: initialInternalFeatureFilterConditions,
	deleteFeatureWarning: 'Are you sure you want to delete?',
	showDeleteWarning: false,
	selectedID: List.of(),
	showFeatureModal: false,
	selectedItem: Map({}),
    currentSelectedUserID: '',
    allUsersWithTaskCount: List.of(),
	// Fake Form Options (Will be getting all these data from rethinkDB in the future!!)
	formOptions: Map({
		devs: List.of(),
		project: List.of('', 'Work Genius', '4.1.0', '3.2.0'),
		pri: List.of('', 'P1', 'P2', 'P3'),
		owner_name: List.of('', 'Roll Tsai', 'Craig Huang', 'Zuoping Li')
	})
});

function filterOriginal(state, type) {
	let nextState = state;
	nextState = nextState.update(`${type}TableData`, () => {
		let keys = nextState.get(`${type}FilterConditions`).keySeq();
		let isKeyDeprecated = true;
		let filteredResult = nextState.get(`${type}TableOriginalData`).filter((item) => {
			return keys.reduce((acc, key) => {
				if (nextState.getIn([`${type}FilterConditions`, key]) === item.get(key)) {
					isKeyDeprecated = false;
				}
				if (item.get(key) !== nextState.getIn([`${type}FilterConditions`, key]) && nextState.getIn([`${type}FilterConditions`, key]) !== '') {
					return acc && false;
				}
				return acc && true;
			}, true);
		});
		if (isKeyDeprecated && filteredResult.isEmpty()) {
			return nextState.get(`${type}TableOriginalData`);
		}
		return filteredResult.isEmpty() ? List.of() : filteredResult;
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
	let category = state.get(`sort${type[0].toUpperCase()+type.slice(1)}TableBy`).get('category');
	let sortStatus = state.get(`sort${type[0].toUpperCase()+type.slice(1)}TableBy`).get('status');

	if (!category || sortStatus === 0) {
		return state;
	}

	state = state.update(`${type}TableData`, (data) => {
		let sorted = data.sort((curr, next) => {
			let result = 0;
			// Get key corresponded to filter title
			let key = state.get(`${type}TitleKeyMap`).filter((map) => {
				return map.get('title') === category;
			}).first().get('key');
			let tempResult = sortAlphaNum(curr.get(key).toString(10), next.get(key).toString(10));
			if (tempResult !== 0 && result === 0) {
				result = tempResult;
			}
			return result;
		});

		if (sortStatus === -1) {
			return sorted.reverse();
		}

		return sorted;
	});

	return state;
}

function customizeTaskData(task) {
	let result = Map();

	Object.keys(task).forEach((key) => {
		switch (key) {
			case 'title':
				let newValue = task[key].length > 75 ? task[key].substr(0, 75) + '...' : task[key];
				result = result.set(key, newValue);
			break;
			default:
				result = result.set(key, task[key]);
		}
	});

	return result.toJS();
}

function formatResponse(data) {
	let result = List.of();

	data.forEach((task) => {
		let updatedTask = customizeTaskData(task);
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
	let formatedData = formatResponse(data);
	return state
	    .set(`${type}TableOriginalData`, formatedData)
	    .set(`${type}TableData`, formatedData);
}

function resetTable(state, type) {
	return state
	    .update(`${type}TableData`, () => {
			return state.get(`${type}TableOriginalData`);
		})
	    .set(`sort${type[0].toUpperCase()+type.slice(1)}TableBy`, Map({
			category: '',
			status: 0
		}))
	    .set(
	    	`${type}FilterConditions`,
	    	initialState.get(`${type}FilterConditions`)
		);
}

function sortTable(state, newCategory, type) {
	let oldCategory = state.get(`sort${type[0].toUpperCase()+type.slice(1)}TableBy`).get('category');
	let oldStatus = state.get(`sort${type[0].toUpperCase()+type.slice(1)}TableBy`).get('status');
	let newStatus = 0;
	if (oldCategory === newCategory) {
		newStatus = oldStatus === 1 ? -1 : oldStatus === -1 ? 0 : 1;
	} else {
		newStatus = 1;
	}
	let category = Map({
		category: newCategory,
		status: newStatus
	});
	state = state.set(`sort${type[0].toUpperCase()+type.slice(1)}TableBy`, category);
	state = filterOriginal(state, type);
	state = sortOriginal(state, type);
	return state;
}

function setSelectedItem(state, id) {
	let matchItem = state.get('internalFeatureTableOriginalData').filter(item => item.get('id') === id).first();
	return state.update('selectedID', (original) => {
		return original.set(0, id);
	}).set('selectedItem', matchItem);
}

function countTasksNumberByType(state, users) {
	let newAllUsersWithTaskCOunt = users.map((user) => {
		let typeCounts = {
				'B': 0,
				'F': 0,
				'N': 0
			},
			subtitle = '';

		user.tasks.forEach((task) => {
			if (task.type === 'bug') {
				typeCounts['B']++;
			} else if (task.type === 'feature') {
				typeCounts['F']++;
			} else if (task.type === 'internal') {
				typeCounts['N']++;
			}
		});
		subtitle = Object.keys(typeCounts).reduce((acc, type) => {
			return `${acc} ${type} ${typeCounts[type]}`;
		}, '').trim();


		return {
			id: user.id,
			name: user.name,
			subtitle
		};
	});
	return state.set('allUsersWithTaskCount', newAllUsersWithTaskCOunt);
}

export default function taskReducer(state = initialState, action) {
	let nextState = state;
	switch (action.type) {
		case actionTypes.SORT_BUG_TABLE_BY_CATEGORY:
			return sortTable(state, action.category, 'bug');
		case actionTypes.SORT_FEATURE_TABLE_BY_CATEGORY:
			return sortTable(state, action.category, 'feature');
		case actionTypes.SORT_INTERNAL_FEATURE_TABLE_BY_CATEGORY:
			return sortTable(state, action.category, 'internalFeature');
		case actionTypes.FILTER_BUG_TABLE:
			return filterTable(state, action.filterConditions, 'bug');
		case actionTypes.FILTER_FEATURE_TABLE:
			return filterTable(state, action.filterConditions, 'feature');
		case actionTypes.FILTER_INTERNAL_FEATURE_TABLE:
			return filterTable(state, action.filterConditions, 'internalFeature');
		case actionTypes.RESET_BUG_TABLE:
			return resetTable(state, 'bug');
		case actionTypes.RESET_FEATURE_TABLE:
			return resetTable(state, 'feature');
		case actionTypes.RESET_INTERNAL_FEATURE_TABLE:
			return resetTable(state, 'internalFeature');
		case actionTypes.SET_DELETE_WARNING_BOX_STATE:
			return state.set('showDeleteWarning', action.state);
		case actionTypes.SET_FEATURE_MODAL_STATE:
			return state.set('showFeatureModal', action.state);
		case actionTypes.SET_SELECTED_ITEM:
			return setSelectedItem(state, action.id);
		case actionTypes.RESET_SELECTED_ITEM:
			return state.set('selectedItem', Map({})).set('selectedID', List.of());
		case actionTypes.FETCH_BUG_SUCCESS:
			nextState = setTableData(state, action.data, 'bug');
			if (!is(state.get('bugFilterConditions'), initialBugFilterConditions)) {
				nextState = filterOriginal(nextState, 'bug');
			}
			if (state.get('sortBugTableBy').get('category')) {
				nextState = sortOriginal(nextState, 'bug');
			}
			return nextState;
		case actionTypes.FETCH_FEATURE_SUCCESS:
			nextState = setTableData(state, action.data, 'feature');
			if (!is(state.get('featureFilterConditions'), initialFeatureFilterConditions)) {
				nextState = filterOriginal(nextState, 'feature');
			}
			if (state.get('sortFeatureTableBy').get('category')) {
				nextState = sortOriginal(nextState, 'feature');
			}
			return nextState;
		case actionTypes.FETCH_INTERNAL_FEATURE_SUCCESS:
			nextState = setTableData(state, action.data, 'internalFeature');
			if (!is(state.get('internalFeatureFilterConditions'), initialInternalFeatureFilterConditions)) {
				nextState = filterOriginal(nextState, 'internalFeature');
			}
			if (state.get('sortInternalFeatureTableBy').get('category')) {
				nextState = sortOriginal(nextState, 'internalFeature');
			}
			return nextState;
        case actionTypes.SET_CURRENT_SELECTED_USER_ID:
            return nextState.set('currentSelectedUserID', action.id === ADMIN_ID ? '' : action.id);
        case actionTypes.FETCH_USERS_WITH_TASKS_SUCCESS:
        	nextState = nextState.setIn(
        		['formOptions', 'devs'],
        		List.of({
        			id: undefined,
        			name: ''
        		}).concat(action.data.map((user) => ({
	        		id: user.id,
	        		name: user.name
	        	})))
	        );
            return countTasksNumberByType(nextState, action.data);
		default:
			return state;
	}
};
