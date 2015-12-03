import { combineReducers } from 'redux';
import app from './app-reducer';
import main from './main-reducer';
import demo from './demo-reducer';
import task from './task-reducer';
import pto from './pto-reducer';

const rootReducer = combineReducers({
	app,
	main,
	demo,
	task,
	pto
});

export default rootReducer;
