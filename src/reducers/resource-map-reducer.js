
import { Map, List, OrderedMap } from 'immutable';
// Constants
import actionTypes from '../constants/action-types';
import moment from 'moment';
// import { ADMIN_ID } from '../../server/constants/configurations.js';
// const initialPTOFilterConditions = Map({
//     'status': ''
// });
const initialState = Map({
	startDate: moment().isoWeekday(0).format('YYYY-MM-DD'),
	totalDays: 10,
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

function checkWorkLogsData(worklogs, item) {
    let worklogItem = {
        content: item.content,
        id: item.id,
        process: item.process,
        tag: item.tag
    };

    let millisecond = parseInt(item.date.format('X'));
    let worklog = worklogs.find((log) => {
        return (log.date === millisecond * 1000 ||
            (typeof log.date === 'object' && parseInt(log.date.format('X')) === millisecond));
    });

    let worklogItems = worklog.worklog_items;

    if (worklogItems === undefined || worklogItems === null) {
        worklogItems = [];
        worklogItems.push(worklogItem);
        return worklogs;
    }

    let logItem = worklogItems.find((log) => {
        return log.id === item.id;
    });

    console.log(logItem);
    if (logItem === undefined) {
        console.log('............................');
        worklogItems.push(worklogItem);
    } else {
        logItem.content = item.content;
        logItem.process = item.process;
        logItem.tag = item.tag;
    }

    return worklogs;

    // worklogs.map((log) => {
    //     // worklog_items
    //     let millisecond = parseInt(item.date.format('X'));
    //     if (log.date === millisecond * 1000 ||
    //         (typeof log.date === 'object' && parseInt(log.date.format('X')) === millisecond)) {
    //         var worklogItems = log.worklog_items;
    //         if (worklogItems === undefined || worklogItems === null) {
    //             worklogItems = [];
    //             worklogItems.push(worklogItem);
    //         }
    //         else if (item.id === undefined || item.id === null) {
    //             worklogItems.push(worklogItem);
    //         } else {
    //             worklogItems.map((logItem) => {
    //                 if (logItem.id === item.id) {
    //                     logItem.content = item.content;
    //                     logItem.process = item.process;
    //                     logItem.tag = item.tag;
    //                 }
    //             });
    //         }
    //     }
    // });
    // return worklogs;

}

function upsertUserItemData(state, item) {
    if (item === undefined || item.employee_id === undefined) {
        return state;
    }
    var newData = List.of(),
        oldData = state.get('data');
    var employeeId = item.employee_id;
    oldData.map((data) => {
        if (data.get('id') === employeeId) {
            let worklogs = data.get('worklogs');
            worklogs = checkWorkLogsData(worklogs, item);
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
		return nextState;
	case actionTypes.FETCH_RESOURCE_MAP_MODAL:
		nextState = nextState.set('show', action.show);
        nextState = setModalInfos(nextState, action.info);
		return nextState;
    case actionTypes.FETCH_RESOURCE_MAP_WORKLOG_UPSERT:
        nextState = upsertUserItemData(nextState, action.item);
        return nextState;
    case actionTypes.FETCH_RESOURCE_MAP_ALL_USERS:
        nextState = setAllUsers(nextState, action.data);
        return nextState;
	default:
		return nextState;
	}
}