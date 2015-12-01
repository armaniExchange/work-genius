import { combineReducers } from 'redux';
import app from './app-reducer';
import demo from './demo-reducer';
import task from './task-reducer';
import user from './user-reducer';

const rootReducer = combineReducers({
	app,
	demo,
	task,
	user
});

export default rootReducer;
