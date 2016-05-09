import { fetchPtoPageData } from './pto-saga';
import { fork } from 'redux-saga/effects';

export default function* rootSaga() {
    yield [
        yield fork(fetchPtoPageData)
    ];
}
