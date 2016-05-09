import { take, call, put } from 'redux-saga/effects';
import {
    fetchPTOApplicationsPromise,
    fetchUsersWithPTOPromise
} from '../actions/pto-page-actions';

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
export function* fetchPtoPageData() {
    while (true) {
        let { userId, selectedYear } = yield take('FETCH_PTO_PAGE_REQUEST');
        yield put({type: 'SET_LOADING_STATE', state: true});
        try {
            let [ptoApplications, usersWithPto] = yield [
                call(fetchPTOApplicationsPromise, userId, selectedYear),
                call(fetchUsersWithPTOPromise, userId, selectedYear)
            ];
            yield [
                put({type: 'FETCH_PTO_APPLICATION_SUCCESS', data: ptoApplications}),
                put({type: 'FETCH_USERS_WITH_PTO_SUCCESS', data: usersWithPto}),
                put({type: 'SET_CURRENT_SELECTED_USER_ID', id: userId})
            ];
            yield put({type: 'SET_LOADING_STATE', state: false});
        } catch (err) {
            yield put({type: 'SET_LOADING_STATE', state: false});
            yield put({type:'API_FAILURE', err: err});
        }
    }
}
