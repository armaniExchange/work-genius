import { combineReducers } from 'redux';
import app from './app-reducer';
import main from './main-reducer';
import demo from './demo-reducer';
import task from './task-reducer';
import pto from './pto-reducer';
import admin from './admin-reducer';
import dataExplorer from './data-explorer-reducer';
import documentation from './document-reducer';
import article from './article-reducer';
import featureAnalysis from './feature-analysis-reducer';
import bugReview from './bug-review-reducer';
import bugReport from './bug-report-reducer';

const rootReducer = combineReducers({
	app,
	main,
	demo,
	task,
	dataExplorer,
	pto,
	admin,
	documentation,
	article,
	bugReview,
  bugReport,
	featureAnalysis
});

export default rootReducer;
