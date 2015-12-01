import { combineReducers } from 'redux';
import app from './app-reducer';
import demo from './demo-reducer';
import task from './task-reducer';
import pto from './pto-reducer';
import user from './user-reducer';

const rootReducer = combineReducers({
	app,
	demo,
	task,
	pto,
	user
});

export default rootReducer;
