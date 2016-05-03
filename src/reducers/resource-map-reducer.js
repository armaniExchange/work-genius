
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
    tags: List.of(),
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
    let worklogItem = item;
    let millisecond = parseInt(item.start_date);
    var worklog = worklogs.find((log) => {
        return (log.date === millisecond ||
            (typeof log.date === 'object' && parseInt(moment(log.date).format('X')) * 1000 === millisecond));
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
    }

    return worklogs;
}

var taskStateActions = {
    handle: function (state, item) {
        console.log('item:');
        console.log(item);
        console.log();
        var employeeId = item.employee_id;
        if (employeeId === undefined || employeeId === -1) {
            return state;
        }
        return this.byUserHandle(state, item);
    },
    byUserHandle: function (state, item) {
        var self = this;
        var newData = List.of(),
            oldData = state.get('data');
        oldData.map((data) => {
            if (data.get('id') === item.employee_id) {
                let worklogs = data.get('jobs');
                worklogs = self.byDaysHandle(worklogs, item.data);
                data = data.set('jobs', worklogs);
            }
            newData = newData.push(data);
        });
        return state.set('data', newData);;
    },
    byDaysHandle: function(dayWorkLog, item) {
        var self = this;
        let startDate = item.start_date;
        let millisecondStartDate = moment(moment(startDate).format('YYYY-MM-DD')).format('X') * 1000;
        // let millisecondOneDay = 24 * 60 * 60 * 1000;
        // let millisecondEndDate = startDate + item.duration * 60 * 60 * 1000;

        var newWorklog = [];
        let duration = item.duration ? item.duration : 0;
        dayWorkLog.map((worklog) => {
            // let currentMilliseconds = millisecondStartDate + index * millisecondOneDay;
            let worklogDate = worklog.date instanceof moment ? worklog.date.format('X') * 1000 : worklog.date;
            // self.isSelectDate(worklogDate, millisecondStartDate, startDate, item.duration);
            if (worklog.day_type !== 'workday') {
                if (self.isSelectDate(worklogDate, millisecondStartDate, duration)) {
                    duration += 8;
                }
            } else {
                var worklogItems = worklog.job_items;
                if (self.isSelectDate(worklogDate, millisecondStartDate, duration)) {
                    // Delete items by id
                    if (item.isDelete) {
                        worklogItems = self.deleteWorkItem(worklogItems, item);
                    } else if (worklogItems === undefined || worklogItems === null) {
                        worklogItems = [];
                        worklogItems.push(item);
                    } else {
                        let logItem = worklogItems.find((log) => {
                            return log.id === item.id;
                        });
                        if (logItem === undefined) {
                            worklogItems.push(item);
                        } else {
                            logItem.content = item.content;
                            logItem.progress = item.progress;
                            self.copyValue(logItem, item);
                        }
                    }
                } else {
                    worklogItems = self.deleteWorkItem(worklogItems, item);
                }
                worklog.job_items = worklogItems;
            }
            newWorklog.push(worklog);
        });

        return newWorklog;
    },
    /**
     * selectDate    Current day
     * startDate     Item start Date
     * duration      Duration day
     */
    isSelectDate: function(selectDate, startDate, duration) {
        // If duration is less than 8, will be compare the start date.
        if (duration === undefined || duration < 8) {
            return (selectDate === startDate);
        }

        // If the select date is weekday, will return false.
        // let day = moment(selectDate).isoWeekday();
        // if (day === 6 || day === 7) {
        //     return false;
        // }
        let index = duration / 8;
        let millisecondOneDay = 24 * 60 * 60 * 1000;
        for (let i = 0; i < index; i ++) {
            if (selectDate === startDate + i * millisecondOneDay) {
                return true;
            }
        }
        return false;
    },
    copyValue: function (targat, copy) {
        for (var key in targat) {
            if (targat.hasOwnProperty(key) && copy.hasOwnProperty(key)) {
                targat[key] = copy[key];
            }
        }
    },
    deleteWorkItem: function (workItems, item) {
        if (workItems === undefined || workItems === null) {
            return workItems;
        }

        workItems.filter((value, index) => {
            if (value.id === item.id) {
                delete workItems[index];
            }
        });

        workItems = workItems.filter(() => true);
        return workItems;
    }
};
function upsertUserItemData(state, item) {
    var employeeId = item.employee_id;
    if (employeeId === undefined || employeeId === -1) {
        return state;
    }
    var newData = List.of(),
        oldData = state.get('data');
    oldData.map((data) => {
        if (data.get('id') === employeeId) {
            let worklogs = data.get('worklogs');
            worklogs = checkWorkLogsData(worklogs, item.data);
            data = data.set('worklogs', worklogs);
        }
        newData = newData.push(data);
    });
    return state.set('data', newData);
}

function setAllTags(state, tags) {
    let formatedData = formatResponse(tags);
    return state
        .set(`tags`, formatedData);
}

function setTag(state, tag) {
    let tags = state.get(`tags`).toJS();
    tags.push(tag);
    let formatedData = formatResponse(tags);
    return state
        .set(`tags`, formatedData);
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
        nextState = taskStateActions.handle(nextState, action.item);
        //nextState = upsertUserItemData(nextState, action.item);
        return nextState;
    case actionTypes.FETCH_RESOURCE_MAP_WORKLOG_ADD_MULTI:
        nextState = upsertUserItemData(nextState, action.items);
        return nextState;
    case actionTypes.FETCH_RESOURCE_MAP_ALL_USERS:
        nextState = setAllUsers(nextState, action.data);
        return nextState;
    case actionTypes.FETCH_RESOURCE_MAP_All_TAG:
        nextState = setAllTags(nextState, action.tags);
        return nextState;
    case actionTypes.FETCH_RESOURCE_MAP_NEW_TAG:
        nextState = setTag(nextState, action.tag);
        return nextState;
	default:
		return nextState;
	}
}