import { combineReducers } from 'redux';
import app from './app-reducer';
import demo from './demo-reducer';
import task from './task-reducer';

const rootReducer = combineReducers({
	app,
	demo,
	task
});

export default rootReducer;
