import { MAIN_URL } from './app';
// single
const BASE_URL = MAIN_URL;
export const FIRST_BREADCRUMB = [{txt:'Home', url: BASE_URL}];

let BREADCRUMB = {
  knowledge: [{txt:'Document', url: BASE_URL + '/knowledge/document'}],
  document: [{txt:'Document', url: BASE_URL + '/knowledge/document'}],
  bugtracking: [{txt:'Bug Tracking', url: BASE_URL + '/knowledge/bug-tracking'}],

  resource: [{txt:'Resources', url: BASE_URL + '/resource/resource-map'}],
  resourcemap: [{txt:'Resource Map', url: BASE_URL + '/resource/resource-map'}],
  teammember: [{txt:'Team Member', url: BASE_URL + '/resource/team'}],

  buganalysis: [{txt:'Bug Analysis', url: BASE_URL + '/bug-analysis/bug-analysis'}],
  bugrootcause: [{txt:'Root Causes', url: BASE_URL + '/bug-analysis/bug-analysis'}],
  analysisreport: [{txt:'Analysis Reports', url: BASE_URL + '/bug-analysis/bug-report'}],

  pageassignment: [{txt:'Page Assignment', url: BASE_URL + '/feature-analysis'}],
  treepageassignment: [{txt:'Tree View', url: BASE_URL + '/feature-analysis'}],
  tablepageassignment: [{txt:'Table View', url: BASE_URL + '/feature-analysis/table'}],

  pto: [{txt:'PTO', url: BASE_URL + '/pto/'}],
  ptoapply: [{txt:'Apply', url: BASE_URL + '/pto/'}],
  overtime: [{txt:'Overtime', url: BASE_URL + '/pto/overtime'}],
  ptoSummary: [{txt:'Summary', url: BASE_URL + '/pto/summary'}],
};

// chain
BREADCRUMB.document = BREADCRUMB.knowledge.concat(BREADCRUMB.document);
BREADCRUMB.bugtracking = BREADCRUMB.knowledge.concat(BREADCRUMB.bugtracking);

BREADCRUMB.resourcemap = BREADCRUMB.resource.concat(BREADCRUMB.resourcemap);
BREADCRUMB.teammember = BREADCRUMB.resource.concat(BREADCRUMB.teammember);

BREADCRUMB.bugrootcause = BREADCRUMB.buganalysis.concat(BREADCRUMB.bugrootcause);
BREADCRUMB.analysisreport = BREADCRUMB.buganalysis.concat(BREADCRUMB.analysisreport);

BREADCRUMB.treepageassignment = BREADCRUMB.pageassignment.concat(BREADCRUMB.treepageassignment);
BREADCRUMB.tablepageassignment = BREADCRUMB.pageassignment.concat(BREADCRUMB.tablepageassignment);

BREADCRUMB.ptoapply = BREADCRUMB.pto.concat(BREADCRUMB.ptoapply);
BREADCRUMB.overtime = BREADCRUMB.pto.concat(BREADCRUMB.overtime);
BREADCRUMB.ptoSummary = BREADCRUMB.pto.concat(BREADCRUMB.ptoSummary);

// export!
export default BREADCRUMB;
