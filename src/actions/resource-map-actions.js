
import actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';
import moment from 'moment';

import {
    setLoadingState,
    apiFailure
} from './app-actions';

function fetchResourceMapData(data, startDate, userId) {
	return {
		type: actionTypes.FETCH_RESOURCE_MAP_DATA,
		data,
		startDate,
        userId
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

function fetchWorklogItems(items) {
    return {
        type: actionTypes.FETCH_RESOURCE_MAP_WORKLOG_ADD_MULTI,
        items
    };
}

export function fetchResourceMapModalHandler(show, info){
	return {
		type: actionTypes.FETCH_RESOURCE_MAP_MODAL,
		show,
        info
	};
}

export function fetchResourecMapAllTag(tags){
    return {
        type: actionTypes.FETCH_RESOURCE_MAP_All_TAG,
        tags
    };
}

export function fetchResourecMapNewTag(tag){
    return {
        type: actionTypes.FETCH_RESOURCE_MAP_NEW_TAG,
        tag
    };
}

export function fetchResourecMapRelease(releases) {
    return {
        type: actionTypes.FETCH_RESOURCE_MAP_ALL_RELEASE,
        releases
    };
}

export function fetchResourecMapNewRelease(release) {
    return {
        type: actionTypes.FETCH_RESOURCE_MAP_NEW_RELEASE,
        release
    };
}

var taskWorkItemActions = {
    create: (item) => {
        return (dispatch, getState) => {
            let user = getState().app.toJS().currentUser;
            var data = item.data;
            data.employee_id = item.employee_id;
            data.creator = user.id;
            let config = {
                method: 'POST',
                body: `mutation RootMutationType {
                    createJobAndWorkLog(data:"${JSON.stringify(data).replace(/\"/gi, '\\"')}")
                }`,
                headers: {
                    'Content-Type': 'application/graphql',
                    'x-access-token': localStorage.token
                }
            };

            return fetch(SERVER_API_URL, config)
                .then((res) => res.json())
                .then((body) => {
                    let id = body.data.createJobAndWorkLog;
                    if (id !== undefined && id !== '' && id !== 0) {
                        item.data.id = id;
                        dispatch(fetchWorklogItem(item));
                    }
                })
                .catch((err) => {
                    throw new Error(err);
                });
        };
    },
    update: (item) => {
        let data = item.data;
        if (item.isStatus) {
            data = {status: data.status};
        }
        return (dispatch) => {
            // let date = parseInt(moment(item.date).format('X')) * 1000;
            // var updateData = {
            //     employee_id: item.employee_id,
            //     content: item.content,
            //     progress: parseInt(item.progress),
            //     date: date,
            //     tag: item.tag,
            //     status: item.status ? item.status : 0
            // };
            let config = {
                method: 'POST',
                body: `mutation RootMutationType {
                    updateJobAndWorkLog(data:"${JSON.stringify(data).replace(/\\/gi, '\\\\').replace(/\"/gi, '\\"')}",id:"` + item.id + `")
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
    },
    delete: (item) => {
        return (dispatch) => {
            let config = {
                method: 'POST',
                body: `mutation RootMutationType {deleteJob(id:\"` + item.id + `\")}`,
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
};


var tagActions = {
    get: function () {
        return (dispatch) => {
            let config = {
                method: 'POST',
                body: `{
                        getAllWorklogTags(name:""){
                            id,
                            tag_name,
                            type
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
                    let tags = body.data.getAllWorklogTags;
                    dispatch(fetchResourecMapAllTag(tags));
                })
                .catch((err) => {
                    throw new Error(err);
                });
        };
    },
    add: function (tag) {
        return (dispatch) => {
            var data = {tag_name: tag};
            let config = {
                method: 'POST',
                body: `mutation RootMutationType {
                    createWorklogTag(data:"${JSON.stringify(data).replace(/\"/gi, '\\"')}")
                }`,
                headers: {
                    'Content-Type': 'application/graphql',
                    'x-access-token': localStorage.token
                }
            };

            return fetch(SERVER_API_URL, config)
                .then((res) => res.json())
                .then(() => {
                    dispatch(fetchResourecMapNewTag(data));
                })
                .catch((err) => {
                    throw new Error(err);
                });
        };
    }
};

var releaseActions = {
    get: function () {
        return (dispatch) => {
            let config = {
                method: 'POST',
                body: `{
                        getAllRelease(name:""){
                            id,
                            tag_name,
                            type
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
                    let release = body.data.getAllRelease;
                    dispatch(fetchResourecMapRelease(release));
                })
                .catch((err) => {
                    throw new Error(err);
                });
        };
    },
    add: function (tag) {
        return (dispatch) => {
            var data = {tag_name: tag};
            let config = {
                method: 'POST',
                body: `mutation RootMutationType {
                    createRelease(data:"${JSON.stringify(data).replace(/\"/gi, '\\"')}")
                }`,
                headers: {
                    'Content-Type': 'application/graphql',
                    'x-access-token': localStorage.token
                }
            };

            return fetch(SERVER_API_URL, config)
                .then((res) => res.json())
                .then(() => {
                    dispatch(fetchResourecMapNewRelease(data));
                })
                .catch((err) => {
                    throw new Error(err);
                });
        };
    }
};

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


function queryResourceMapDataFromServer(startDate, days) {
    let date = parseInt(moment(startDate).format('X')) * 1000;
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
                getJobList(startDate:` + date + `,dateRange:` + days +`){
			        id,
			        name,
			        jobs{
			            date,
			            day_type,
			            job_items{
			                id,
                            start_date,
                            content,
                            progress,
                            color,
                            status,
                            title,
                            duration,
                            release,
                            creator,
                            tags
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
                dispatch(setLoadingState(false));
            	let data = body.data.getJobList;
            	data = data === undefined ? [] : data;
            	dispatch(fetchResourceMapData(data, startDate));
            })
            .catch((err) => {
                dispatch(setLoadingState(false));
                throw new Error(err);
            });
    };
}

function queryResourceMapDataFromServerByUser(startDate, days, userId) {
    let date = parseInt(moment(startDate).format('X')) * 1000;
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `{
                getJobByEmployeeId(startDate:` + date + `,dateRange:` + days +`,employeeId:\"` + userId + `\"){
                    id,
                    name,
                    jobs{
                        date,
                        day_type,
                        job_items{
                            id,
                            start_date,
                            content,
                            progress,
                            color,
                            status,
                            title,
                            duration,
                            release,
                            creator,
                            tags
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
                dispatch(setLoadingState(false));
                let data = body.data.getJobByEmployeeId;
                data = data === undefined ? [] : data;
                // console.log(JSON.stringify(data, null, 4));
                dispatch(fetchResourceMapData(data, startDate, userId));
            })
            .catch((err) => {
                dispatch(setLoadingState(false));
                throw new Error(err);
            });
    };
}

function workLogItemCreateMulti(items) {
    return (dispatch) => {
        let createDatas = items.map((item) => {
            let date = parseInt(moment(item.date).format('X')) * 1000;
            let data = {
                employee_id: item.employee_id,
                content: item.content,
                progress: parseInt(item.progress),
                date: date,
                tag: item.tag,
                status: item.status ? item.status : 0
            };
            return data;
        });
        let worklogs = {
            worklog: createDatas
        };
        let config = {
            method: 'POST',
            body: `mutation RootMutationType {
                createWorkLogBatch(data:"${JSON.stringify(worklogs).replace(/\"/gi, '\\"')}")
            }`,
            headers: {
                'Content-Type': 'application/graphql',
                'x-access-token': localStorage.token
            }
        };

        return fetch(SERVER_API_URL, config)
            .then((res) => res.json())
            .then((body) => {
                let workLogBatchIds = body.data.createWorkLogBatch;
                workLogBatchIds = workLogBatchIds.split(',');
                let newItems = items.map((item, index) => {
                    item.id = workLogBatchIds[index];
                    return item;
                });
                dispatch(fetchWorklogItems(newItems));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
}

function workLogItemDelete(item) {
    return (dispatch) => {
        let config = {
            method: 'POST',
            body: `mutation RootMutationType {deleteJob(id:\"` + item.id + `\")}`,
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
            dispatch(taskWorkItemActions.create(item));
        };
    } else {
        return (dispatch) => {
            dispatch(taskWorkItemActions.update(item));
        };
    }
}

function queryResourceMapDataByUser(startDate, days, userId) {
    return (dispatch, getState) => {
        if (userId === 0) {
            let user = getState().app.toJS().currentUser;
            let privilege = user.privilege;
            privilege = privilege ? privilege : 10;
            // if (user.name === 'Craig Huang' || user.name ==='Zuoping Li') {
            if (privilege > 5) {
                userId = '';
            } else {
                userId = user.id;
            }
        }

        if (userId === 'undefined' || userId === '') {
            dispatch(queryResourceMapDataFromServer(startDate, days));
        } else {
            dispatch(queryResourceMapDataFromServerByUser(startDate, days, userId));
        }
    };
}

export function fetchResourceMapAddMulti(items) {
    return (dispatch) => {
        Promise.all([
            dispatch(workLogItemCreateMulti(items))
        ]).then(
            () => {
            },
            (err) => {
                dispatch(apiFailure(err));
            }
        );
    };
}


export function fetchResourceMapDeleteItem(item) {
    return (dispatch) => {
        Promise.all([
            dispatch(workLogItemDelete(item))
        ]).then(
            () => {
            },
            (err) => {
                dispatch(apiFailure(err));
            }
        );
    };
}

export function fetchResourceMapStatus(item) {
    return (dispatch) => {
        Promise.all([
            dispatch(taskWorkItemActions.update(item))
        ]).then(
            () => {
            },
            (err) => {
                dispatch(apiFailure(err));
            }
        );
    };
}

export function queryResourceMapData(startDate, days, userId) {
	return (dispatch) => {
		dispatch(setLoadingState(true));
        Promise.all([
			dispatch(queryResourceMapDataByUser(startDate, days, userId))
		]).then(
            () => {
                // dispatch(setLoadingState(false));
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

export function queryResourceMapTags() {
    return (dispatch) => {
        Promise.all([
            dispatch(tagActions.get())
        ]);
    };
}

export function addResourceMapTag(tag) {
    return (dispatch) => {
        Promise.all([
            dispatch(tagActions.add(tag))
        ]);
    };
}


export function queryResourceMapRelease() {
    return (dispatch) => {
        Promise.all([
            dispatch(releaseActions.get())
        ]);
    };
}

export function addResourceMapRelease(release) {
    return (dispatch) => {
        Promise.all([
            dispatch(releaseActions.add(release))
        ]);
    };
}




