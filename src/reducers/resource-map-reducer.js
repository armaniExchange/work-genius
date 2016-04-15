
import { Map, List, OrderedMap } from 'immutable';
// Constants
import actionTypes from '../constants/action-types';
import moment from 'moment';
// import { ADMIN_ID } from '../../server/constants/configurations.js';
// const initialPTOFilterConditions = Map({
//     'status': ''
// });
const initialState = Map({
	startDate: moment().isoWeekday(1).format('YYYY-MM-DD'),
	totalDays: 7,
	// data: List.of(
	// 	Map({'name': 'Ruiz', 'items': List.of(
	// 		Map({'item': Map({ 'type': '1', 'date': '1' }) }),
	// 		Map({'item': Map({ 'type': 'log', 'date': 21234, id: '', missions: List.of() }) }),
	// 		Map({'item': Map({ 'type': 'pto', 'date': 21234, id: ''}) }),
	// 		Map({'item': null}),
	// 		Map({'item': null}),
	// 		Map({'item': null}),
	// 		Map({'item': null}),
	// 		Map({'item': null}),
	// 		Map({'item': null}),
	// 		Map({'item': null})
	// 	)})
	// ),
	data: List.of(),
    allUsers: List.of(),
    currentUserId: '',
	show: false,
    defaultModalInfos: Map({})
});

function customizeTaskData(task) {
    let result = Map();

    Object.keys(task).forEach((key) => {
        switch (key) {
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

function setModalInfos(state, info){
    let formatedData = customizeTaskData(info);
    return state.set('defaultModalInfos', formatedData);
}

function setTableData(state, data) {
    let formatedData = formatResponse(data);
    return state
        .set(`data`, formatedData);
}

function setAllUsers(state, data) {
    let formatedData = formatResponse(data);
    return state
        .set(`allUsers`, formatedData);
}

function setStartDate(state, startDate) {
	return state.set('startDate', startDate);
}

function checkWorkLogsDataDelete(worklogItems, item) {
    if (worklogItems === undefined || worklogItems === null) {
        return worklogItems;
    }

    worklogItems.filter((value, index) => {
        if (value.id === item.id) {
            delete worklogItems[index];
        }
    });

    worklogItems = worklogItems.filter(() => true);
    return worklogItems;
}

function checkWorkLogsData(worklogs, item) {
    let worklogItem = {
        content: item.content,
        id: item.id,
        progress: item.progress,
        tag: item.tag
    };
    let millisecond = parseInt(moment(item.date).format('X'));
    var worklog = worklogs.find((log) => {
        return (log.date === millisecond * 1000 ||
            (typeof log.date === 'object' && parseInt(moment(log.date).format('X')) === millisecond));
    });
    let worklogItems = worklog.worklog_items;

    if (item.isDelete) {
        worklogItems = checkWorkLogsDataDelete(worklogItems, item);
        worklog.worklog_items = worklogItems;
        return worklogs;
    }


    if (worklogItems === undefined || worklogItems === null) {
        worklogItems = [];
        worklogItems.push(worklogItem);
        worklog.worklog_items = worklogItems;
        return worklogs;
    }

    let logItem = worklogItems.find((log) => {
        return log.id === item.id;
    });

    if (logItem === undefined) {
        worklogItems.push(worklogItem);
    } else {
        logItem.content = item.content;
        logItem.progress = item.progress;
        logItem.tag = item.tag;
    }

    return worklogs;
}

function checkWorkLogWithNewItem(worklogs, item) {
    if (item.length === undefined) {
        worklogs = checkWorkLogsData(worklogs, item);
        return worklogs;
    }

    for (let it of item) {
        worklogs = checkWorkLogsData(worklogs, it);
    }
    return worklogs;
}

function getItemEmployeeId(item) {
    if (item === undefined) {
        return -1;
    }

    if (item.length > 0) {
        return item[0].employee_id;
    } else {
        return item.employee_id;
    }
}

function upsertUserItemData(state, item) {
    var employeeId = getItemEmployeeId(item);
    if (employeeId === undefined || employeeId === -1) {
        return state;
    }
    var newData = List.of(),
        oldData = state.get('data');
    oldData.map((data) => {
        if (data.get('id') === employeeId) {
            let worklogs = data.get('worklogs');
            worklogs = checkWorkLogWithNewItem(worklogs, item);
            data = data.set('worklogs', worklogs);
        }
        newData = newData.push(data);
    });
    return state.set('data', newData);
}

export default function resourceMapReducer(state = initialState, action) {
	var nextState = state;
	switch (action.type){
	case actionTypes.FETCH_RESOURCE_MAP_DATA:
		nextState = setTableData(nextState, action.data);
		nextState = setStartDate(nextState, action.startDate);
        nextState = nextState.set('currentUserId', String(action.userId));
		return nextState;
	case actionTypes.FETCH_RESOURCE_MAP_MODAL:
		nextState = nextState.set('show', action.show);
        nextState = setModalInfos(nextState, action.info);
		return nextState;
    case actionTypes.FETCH_RESOURCE_MAP_WORKLOG_UPSERT:
        nextState = upsertUserItemData(nextState, action.item);
        return nextState;
    case actionTypes.FETCH_RESOURCE_MAP_WORKLOG_ADD_MULTI:
        nextState = upsertUserItemData(nextState, action.items);
        return nextState;
    case actionTypes.FETCH_RESOURCE_MAP_ALL_USERS:
        nextState = setAllUsers(nextState, action.data);
        return nextState;
	default:
		return nextState;
	}
}