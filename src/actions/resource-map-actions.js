import actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';

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


function queryResourceMapDataFromServer(startDate) {
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
                getWorkLogList(startDate:1460044800000,dateRange:10){
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

function workLogItemCreate(item) {
    return (dispatch) => {
        let date = parseInt(item.date.format('X')) * 1000;
        let config = {
            method: 'POST',
            body: `mutation RootMutationType {
                createWorkLog(
                    data:"{
                        \"employee_id\":\"` + item.employee_id + `\",
                        \"date\":` + date + `,
                        \"content\":\"` + item.content + `\"
                    }"
                )
            }`,
            headers: {
                'Content-Type': 'application/graphql',
                'x-access-token': localStorage.token
            }
        };

        return fetch(SERVER_API_URL, config)
            .then((res) => res.json())
            .then((body) => {
                console.log(body.data);
                dispatch(fetchWorklogItem(item));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
}

function workLogItemUpdate(item) {
    return (dispatch) => {
        let date = parseInt(item.date.format('X')) * 1000;
        let config = {
            method: 'POST',
            body: `mutation RootMutationType {
                updateWorkLog(
                    data:"{
                        \"employee_id\":\"` + item.employee_id + `\",
                        \"date\":` + date + `,
                        \"content\":\"` + item.content + `\"
                    }",
                    id:\"` + item.id + `\"
                )
            }`,
            headers: {
                'Content-Type': 'application/graphql',
                'x-access-token': localStorage.token
            }
        };

        console.log(config);

        return fetch(SERVER_API_URL, config)
            .then((res) => res.json())
            .then((body) => {
                console.log(body.data);
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

export function queryResourceMapData(startDate) {
	// return (dispatch) => {
	// 	dispatch(fetchResourceMapData(startDate));
	// };
	return (dispatch) => {
		dispatch(setLoadingState(true));
        Promise.all([
			dispatch(queryResourceMapDataFromServer(startDate))
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
    // return {
    //     type: actionTypes.FETCH_RESOURCE_MAP_WORKLOG_UPSERT,
    //     item
    // };
    return (dispatch) => {
        Promise.all([
            dispatch(workLogItemUpsert(item))
        ]);
    };
}



