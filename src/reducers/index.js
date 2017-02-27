import { combineReducers } from 'redux';
import app from './app-reducer';
import main from './main-reducer';
import demo from './demo-reducer';
import task from './task-reducer';
import axapiAutomation from './axapi-automation-reducer';
import search from './search-reducer';
import pto from './pto-reducer';
import admin from './admin-reducer';
import dataExplorer from './data-explorer-reducer';
import dashboardReducer from './dashboard-reducer';
import documentation from './document-reducer';
import article from './article-reducer';
import featureAnalysis from './feature-analysis-reducer';
import bugReview from './bug-review-reducer';
import bugReport from './bug-report-reducer';
import bugPerformance from './bug-performance-reducer';
import resourceMap from './resource-map-reducer';
import workLog from './work-log-reducer';
import documentTemplate from './document-template-reducer';
import featureAutomation from './feature-automation-reducer';
import device from './device-reducer';

const rootReducer = combineReducers({
  app,
  main,
  demo,
  device,
  task,
  axapiAutomation,
  search,
  dataExplorer,
  dashboardReducer,
  pto,
  admin,
  documentation,
  article,
  bugReview,
  resourceMap,
  workLog,
  bugReport,
  bugPerformance,
  featureAnalysis,
  documentTemplate,
  featureAutomation
});

export default rootReducer;
