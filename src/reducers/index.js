import { combineReducers } from 'redux';
import app from './app-reducer';
import demo from './demo-reducer';
import task from './task-reducer';
import pto from './pto-reducer';

const rootReducer = combineReducers({
	app,
	demo,
	task,
	pto
});

export default rootReducer;
