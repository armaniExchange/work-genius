/**
 * @author Yushan Hou
 */
// Libraries
import fetch from 'isomorphic-fetch';
// Constants
import actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';
// Actions
import {
    setLoadingState,
    apiFailure
} from './app-actions';

export function fetchReleaseListSuccess(data) {
    return {
        type: actionTypes.FETCH_RELEASE_LIST_SUCCESS,
        data
    };
};

export function fetchReleaseList() {
    return (dispatch) => {
    	let name = '';
        let config = {
            method: 'POST',
            body: `{
                getReleaseList(name: "${name}") {
                    id,
			        name,
			        date,
			        priority
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
                dispatch(fetchReleaseListSuccess(body.data.getReleaseList));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
};

let ReleaseAction = {
	modify: function(item){
		return (dispatch) => {
            var data = item.data;
            let config = {
                method: 'POST',
                body: `mutation RootMutationType {
                    modifyRelease(data:"${JSON.stringify(data).replace(/\"/gi, '\\"')}")
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
                        //dispatch(fetchWorklogItem(item));
                        dispatch(fetchReleaseListSuccess(item.employee_id,getState));
                    }
                })
                .catch((err) => {
                    throw new Error(err);
                });
        };
	}
};