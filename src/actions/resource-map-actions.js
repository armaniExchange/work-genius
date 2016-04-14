import actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';
import moment from 'moment';

import {
    setLoadingState,
    apiFailure
} from './app-actions';

function fetchResourceMapData(data, startDate) {
	return {
		type: actionTypes.FETCH_RESOURCE_MAP_DATA,
		data,
		startDate
	};
}

function fetchAllUsersSuccess(data) {
    return {
        type: actionTypes.FETCH_RESOURCE_MAP_ALL_USERS,
        data,
    };
}

function fetchWorklogItem(item) {
    return {
        type: actionTypes.FETCH_RESOURCE_MAP_WORKLOG_UPSERT,
        item
    };
}

export function fetchResourceMapModalHandler(show, info){
	return {
		type: actionTypes.FETCH_RESOURCE_MAP_MODAL,
		show,
        info
	};
}

export function fetchAllUsersRequest(){
  return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
                    allUsers{
                        id,
                        email,
                        name,
                        nickname,
                        alias
                    }
            }`,
            headers: {
                'Content-Type': 'application/graphql',
                'x-access-token': localStorage.token
            }
        };
        return fetch(SERVER_API_URL, config)
            .then((res) => res.json())
            .then((body) => {
                dispatch(fetchAllUsersSuccess(body.data.allUsers));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
}


function queryResourceMapDataFromServer(startDate) {
    console.log('......................');
    console.log(startDate);
    let date = parseInt(moment(startDate).format('X')) * 1000;
    console.log(date);
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
                getWorkLogList(startDate:` + date + `,dateRange:10){
			        id,
			        name,
			        worklogs{
			            date,
			            type,
			            worklog_items{
			                id,
			                content
			            }
			        }
			    }
            }`,
            headers: {
                'Content-Type': 'application/graphql',
                'x-access-token': localStorage.token
            }
        };
        return fetch(SERVER_API_URL, config)
            .then((res) => res.json())
            .then((body) => {
            	let data = body.data.getWorkLogList;
            	data = data === undefined ? [] : data;
            	dispatch(fetchResourceMapData(data, startDate));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
}

function queryResourceMapDataFromServerByUser(startDate, userId) {
    let date = parseInt(moment(startDate).format('X')) * 1000;
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
                getWorkLogByEmployeeId(startDate:` + date + `,dateRange:10,employeeId:\"` + userId + `\"){
                    id,
                    name,
                    worklogs{
                        date,
                        type,
                        worklog_items{
                            id,
                            content
                        }
                    }
                }
            }`,
            headers: {
                'Content-Type': 'application/graphql',
                'x-access-token': localStorage.token
            }
        };
        return fetch(SERVER_API_URL, config)
            .then((res) => res.json())
            .then((body) => {
                let data = body.data.getWorkLogByEmployeeId;
                data = data === undefined ? [] : data;
                dispatch(fetchResourceMapData(data, startDate));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
}

function workLogItemCreate(item) {
    return (dispatch) => {
        let date = parseInt(item.date.format('X')) * 1000;
        var createData = {
            employee_id: item.employee_id,
            date: date,
            content: item.content,
            tag: item.tag
        };
        let config = {
            method: 'POST',
            body: `mutation RootMutationType {
                createWorkLog(data:"${JSON.stringify(createData).replace(/\"/gi, '\\"')}")
            }`,
            headers: {
                'Content-Type': 'application/graphql',
                'x-access-token': localStorage.token
            }
        };

        return fetch(SERVER_API_URL, config)
            .then((res) => res.json())
            .then((body) => {
                let id = body.data.createWorkLog;
                console.log(id);
                if (id !== undefined && id !== '' && id !== 0) {
                    item.id = id;
                    dispatch(fetchWorklogItem(item));
                }
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
}

function workLogItemUpdate(item) {

    return (dispatch) => {
        let date = parseInt(item.date.format('X')) * 1000;
        var updateData = {
            employee_id: item.employee_id,
            date: date,
            content: item.content,
            tag: item.tag
        };
        let config = {
            method: 'POST',
            body: `mutation RootMutationType {
                updateWorkLog(data:"${JSON.stringify(updateData).replace(/\"/gi, '\\"')}",id:"` + item.id + `")
            }`,
            headers: {
                'Content-Type': 'application/graphql',
                'x-access-token': localStorage.token
            }
        };

        return fetch(SERVER_API_URL, config)
            .then((res) => res.json())
            .then(() => {
                dispatch(fetchWorklogItem(item));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
}

function workLogItemUpsert(item) {
    if (item.id === undefined || item.id === null) {
        return (dispatch) => {
            dispatch(workLogItemCreate(item));
        };
    } else {
        return (dispatch) => {
            dispatch(workLogItemUpdate(item));
        };
    }
}

function queryResourceMapDataByUser(startDate, userId) {
    return (dispatch, getState) => {
        if (userId === 0) {
            userId = getState().app.toJS().currentUser.id;
        }
        if (userId === 1) {
            dispatch(queryResourceMapDataFromServer(startDate));
        } else {
            dispatch(queryResourceMapDataFromServerByUser(startDate, userId));
        }
    };
}

export function queryResourceMapData(startDate, userId) {
	// return (dispatch) => {
	// 	dispatch(fetchResourceMapData(startDate));
	// };
	return (dispatch) => {
		dispatch(setLoadingState(true));
        Promise.all([
			dispatch(queryResourceMapDataByUser(startDate, userId))
		]).then(
            () => {
                dispatch(setLoadingState(false));
            },
            (err) => {
                dispatch(setLoadingState(false));
                dispatch(apiFailure(err));
            }
        );
	};
}

export function upsertWorklogItem(item) {
    return (dispatch) => {
        Promise.all([
            dispatch(workLogItemUpsert(item))
        ]);
    };
}



