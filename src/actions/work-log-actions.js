// import stringifyObject from '../libraries/stringifyObject';

import actionTypes from '../constants/action-types';
import moment from 'moment';
import {
  SERVER_API_URL
} from '../constants/config';
import {
    setLoadingState,
    apiFailure
} from './app-actions';


export function fetchArticlesSuccess(articleList, count) {
  return {
    type: actionTypes.FETCH_WORKLOGS_SUCCESS,
    articleList,
    count
  };
}

export function fetchWorkLogList(list) {
  console.log(list);
  return {
    type: actionTypes.FETCH_WORKLOGS_LIST,
    list
  };
}

export function fetchWorkLogNew(workLog) {
  return {
    type: actionTypes.CREATE_WORKLOG_SUCCESS,
    workLog
  };
}

export function fetchWorkLogUpdate(workLog) {
  return {
    type: actionTypes.UPDATE_WORKLOG_SUCCESS,
    workLog
  };
}

export function fetchWorkLogTagAdd(tag) {
  return {
    type: actionTypes.FETCH_WORKLOGS_TAG_ADD,
    tag
  };
}

export function fetchWorkLogTags(tags) {
  return {
    type: actionTypes.FETCH_WORKLOGS_TAG,
    tags
  };
}

export function fetchArticlesFail(error) {
  return {
    type: actionTypes.FETCH_WORKLOGS_FAIL,
    error
  };
}


export function setAllUsers(users) {
    return {
        type: actionTypes.SET_ALL_USER,
        users
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
                dispatch(setAllUsers(body.data.allUsers));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
}

export function updateArticlesQuery(query) {
  return dispatch => {
    dispatch ({
      type: actionTypes.UPDATE_WORKLOGS_QUERY,
      ...query
    });
  };
}

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
                    dispatch(fetchWorkLogTags(tags));
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
                    dispatch(fetchWorkLogTagAdd(data));
                })
                .catch((err) => {
                    throw new Error(err);
                });
        };
    }
};


export function tagAction(cmd, tag) {
  return dispatch => {
    if (cmd === 'get') {
      dispatch(tagActions.get());
    } else {
      dispatch(tagActions.add(tag));
    }
  };
}

var workLogActions = {

  get: function () {
    return (dispatch) => {
        let startDate = parseInt(moment().isoWeekday(1).format('x'));
        let config = {
            method: 'POST',
            body: `{
                    getWorkLogList(startDate:` + startDate + `,dateRange:10){
                        tags,
                        title,
                        content
                    }
            }`,
            headers: {
                'Content-Type': 'application/graphql',
                'x-access-token': localStorage.token
            }
        };
        console.log(JSON.stringify(config, null, 4));
        return fetch(SERVER_API_URL, config)
            .then((res) => res.json())
            .then((body) => {
                let workLogList = body.data.getWorkLogList;
                console.log(workLogList);
                workLogList = workLogList ? workLogList : [];
                dispatch(fetchWorkLogList(workLogList));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
  },

  create: function (data) {
    console.log(JSON.stringify(data, null, 4));
    return (dispatch) => {
      let config = {
        method: 'POST',
        body: `mutation RootMutationType {
            createWorkLog(data:"${JSON.stringify(data).replace(/\"/gi, '\\"')}")
        }`,
        headers: {
            'Content-Type': 'application/graphql',
            'x-access-token': localStorage.token
        }
      };

      return fetch(SERVER_API_URL, config)
        .then((res) => res.json())
        .then(() => {
          console.log('cccsdfsdf');
          dispatch(fetchWorkLogNew(data));
        })
        .catch((err) => {
            throw new Error(err);
        });
    };
  },

  update: function (data) {
    return (dispatch) => {
      let config = {
        method: 'POST',
        body: `mutation RootMutationType {
          updateArticle(data:"${JSON.stringify(data).replace(/\"/gi, '\\"')}",id:"` + data.id + `")
        }`,
        headers: {
            'Content-Type': 'application/graphql',
            'x-access-token': localStorage.token
        }
      };

      return fetch(SERVER_API_URL, config)
        .then((res) => res.json())
        .then(() => {
            dispatch(fetchWorkLogNew(data));
        })
        .catch((err) => {
            throw new Error(err);
        });
    };
  },

  delete: function (data) {
    return (dispatch) => {
      let config = {
        method: 'POST',
        body: `mutation RootMutationType {deleteWorkLog(id:\"` + data.id + `\")}`,
        headers: {
            'Content-Type': 'application/graphql',
            'x-access-token': localStorage.token
        }
      };

      return fetch(SERVER_API_URL, config)
        .then((res) => res.json())
        .then(() => {
            dispatch(fetchWorkLogNew(data));
        })
        .catch((err) => {
            throw new Error(err);
        });
    };
  }
};

function createWorkLog__ (data) {
    console.log(JSON.stringify(data, null, 4));
    return (dispatch) => {
      let config = {
        method: 'POST',
        body: `mutation RootMutationType {
            createWorkLog(data:"${JSON.stringify(data).replace(/\"/gi, '\\"')}")
        }`,
        headers: {
            'Content-Type': 'application/graphql',
            'x-access-token': localStorage.token
        }
      };

      return fetch(SERVER_API_URL, config)
        .then((res) => res.json())
        .then(() => {
          console.log('cccsdfsdf');
          dispatch(fetchWorkLogNew(data));
        })
        .catch((err) => {
            throw new Error(err);
        });
    };
  }

export function createWorkLog(workLog){
  return (dispatch, getState) => {
    let user = getState().app.toJS().currentUser;
    console.log(user);
    workLog = workLog ? workLog : {};
    workLog.author_id = user.id;
    Promise.all([
        dispatch(createWorkLog__(workLog))
    ]).then(
        () => {
        },
        (err) => {
            dispatch(apiFailure(err));
        }
    );
  };
}

export function updateWorkLog(workLog){
  return (dispatch) => {
    workLog = workLog ? workLog : {};
    Promise.all([
        dispatch(workLogActions.update(workLog))
    ]).then(
        () => {
        },
        (err) => {
            dispatch(apiFailure(err));
        }
    );
  };
}

export function deleteWorkLog(workLog){
  return (dispatch) => {
    workLog = workLog ? workLog : {};
    Promise.all([
        dispatch(workLogActions.delete(workLog))
    ]).then(
        () => {
        },
        (err) => {
            dispatch(apiFailure(err));
        }
    );
  };
}

export function getWorkLogs() {
  return (dispatch) => {
    Promise.all([
        dispatch(workLogActions.get())
    ]).then(
        () => {
        },
        (err) => {
            dispatch(apiFailure(err));
        }
    );
  };
}

export function fetchArticles(query = {}) {
  return dispatch => {
    // dispatch({
    //   type: actionTypes.FETCH_WORKLOGS
    // });
    dispatch(setLoadingState(true));

    let queryString = Object.keys(query)
      .reduce((previous, key) => previous + `${key}: ${JSON.stringify(query[key])} `, '');
    if (queryString !== '') {
      queryString = `(${queryString})`;
    }
    const config = {
      method: 'POST',
      body: `{
        getAllArticles ${queryString} {
          articles {
            id,
            title,
            content,
            tags,
            author {
              id,
              name
            },
            createdAt,
            updatedAt
          },
          count
        }
      }`,
      headers: {
        'Content-Type': 'application/graphql',
        'x-access-token': localStorage.token
      }
    };
    return fetch(SERVER_API_URL, config)
      // .then((res) => {
      //   if (res.status >= 400) {
      //     throw new Error(res.statusText);
      //   }
      //   return res.json();
      // })
      .then(() => {
        //body
        // dispatch(fetchArticlesSuccess(body.data.getWorkLogList.articles, body.data.getWorkLogList.count));
        // dispatch(setLoadingState(false));

        // fake data
        var articleList = [
          {
            'title': 'first log',
            'content': 'content for first log',
            'author': {'id': '19563', 'name': 'Zhiyou Gao'},
            'createdAt': 1461314136095,
            'updatedAt': 1461314136095,
            'tags': []
          },
          {
            'title': 'second log',
            'content': 'content for second log',
            'author': {'id': '19563', 'name': 'Zhiyou Gao'},
            'createdAt': 1461313749897,
            'updatedAt': 1461313749897,
            'tags': []
          }
        ];
        dispatch(fetchArticlesSuccess(articleList, articleList.length));
        dispatch(setLoadingState(false));
      })
      .catch((error) => {
        dispatch(fetchArticlesFail(error));
        dispatch(apiFailure(error));
      });
  };
}


