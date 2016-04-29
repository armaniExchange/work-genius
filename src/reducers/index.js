import { combineReducers } from 'redux';
import app from './app-reducer';
import main from './main-reducer';
import demo from './demo-reducer';
import task from './task-reducer';
import search from './search-reducer';
import pto from './pto-reducer';
import admin from './admin-reducer';
import dataExplorer from './data-explorer-reducer';
import documentation from './document-reducer';
import article from './article-reducer';
import featureAnalysis from './feature-analysis-reducer';
import bugReview from './bug-review-reducer';
import bugReport from './bug-report-reducer';
import resourceMap from './resource-map-reducer';
import workLog from './work-log-reducer';

const rootReducer = combineReducers({
	app,
	main,
	demo,
  task,
	search,
	dataExplorer,
	pto,
	admin,
	documentation,
	article,
	bugReview,
	resourceMap,
	workLog,
	bugReport,
	featureAnalysis
});

export default rootReducer;
