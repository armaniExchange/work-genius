import actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';

// import {
//     setLoadingState,
//     apiFailure
// } from './app-actions';

function fetchResourceMapData(startDate) {
	return {
		type: actionTypes.FETCH_RESOURCE_MAP_DATA,
		startDate
	};
}

export function fetchResourceMapModalHandler(show){
	return {
		type: actionTypes.FETCH_RESOURCE_MAP_MODAL,
		show
	};
}


export function queryResourceMapDataFromServer(startDate) {
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
            	console.log(body.data.getWorkLogList);
            	dispatch(fetchResourceMapData(startDate));
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
}

export function queryResourceMapData(startDate) {
	return (dispatch) => {
		dispatch(fetchResourceMapData(startDate));
	};
	// return (dispatch) => {
	// 	dispatch(setLoadingState(true));
 //        Promise.all([
	// 		dispatch(queryResourceMapDataFromServer(startDate))
	// 	]).then(
 //            () => {
 //                dispatch(setLoadingState(false));
 //            },
 //            (err) => {
 //                dispatch(setLoadingState(false));
 //                dispatch(apiFailure(err));
 //            }
 //        );
	// };
}



