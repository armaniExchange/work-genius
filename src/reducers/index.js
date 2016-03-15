import { combineReducers } from 'redux';
import app from './app-reducer';
import main from './main-reducer';
import demo from './demo-reducer';
import task from './task-reducer';
import pto from './pto-reducer';
import admin from './admin-reducer';
import dataExplorer from './data-explorer-reducer';
import documentation from './document-reducer';
import editArticle from './edit-article-reducer';

const rootReducer = combineReducers({
	app,
	main,
	demo,
	task,
	dataExplorer,
	pto,
	admin,
  documentation,
  editArticle
});

export default rootReducer;
