// Libraries
import React from 'react';
import Router, { Route, IndexRoute } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
// Components
import App from '../containers/App/App';
import Main from '../containers/Main/Main';
//import AdminPage from '../containers/AdminPage/AdminPage'; //remove for a while
import ValidDemoPage from '../containers/ValidDemoPage/ValidDemoPage';
import DashboardPage from '../containers/DashboardPage/DashboardPage';
import BugTrackingPage from '../containers/KnowledgePage/BugTrackingPage';
import TaskPage from '../containers/TaskPage/TaskPage';
import PTOPage from '../containers/PTOPage/PTOPage';
import PTOApplication from '../containers/PTOPage/PTO-Application';
import PTOOvertime from '../containers/PTOPage/PTO-Overtime';
import PTOSummary from '../containers/PTOPage/PTO-Summary';
import BugAnalysisPage from '../containers/BugAnalysisPage/BugAnalysisPage';
import BugReviewPage from '../containers/BugAnalysisPage/BugReviewPage';
import BugReportPage from '../containers/BugAnalysisPage/BugReportPage';
import ResourcePage from '../containers/ResourcePage/ResourcePage.js';
import ResourceMapPage from '../containers/ResourcePage/ResourceMapPage.js';
import TeamMemberPage from '../containers/ResourcePage/TeamMemberPage.js';
import DataExplorerPage from '../containers/DataExplorerPage/DataExplorerPage';
import DataExplorerFolderView from '../containers/DataExplorerFolderView/DataExplorerFolderView';
import DataExplorerFileView from '../containers/DataExplorerFileView/DataExplorerFileView';
import Login from '../containers/Login/Login';
import NotFoundPage from '../containers/NotFoundPage/NotFoundPage';
import KnowledgePage from '../containers/KnowledgePage/KnowledgePage';
import DocumentPage from '../containers/KnowledgePage/DocumentPage';
import EditArticlePage from '../containers/EditArticlePage/EditArticlePage';
import ViewArticlePage from '../containers/ViewArticlePage/ViewArticlePage';
import FeatureAnalysisPage from '../containers/FeatureAnalysisPage/FeatureAnalysisPage';
import FeatureAnalysisTreePage from '../containers/FeatureAnalysisPage/FeatureAnalysisTree';
import FeatureAnalysisTablePage from '../containers/FeatureAnalysisPage/FeatureAnalysisTable';
import MarkdownCheatSheet from '../containers/MarkdownCheatSheet/MarkdownCheatSheet';

// Utilities
import requireAuth from '../containers/Require-Auth/Require-Auth';

// Demo Component (To be removed)
import DemoPage from '../containers/DemoPage/DemoPage';

const appRoutes = () => (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={App}>
      <IndexRoute component={Login} />

      <Route path="main" component={requireAuth(Main)}>
        <IndexRoute component={requireAuth(DashboardPage)}/>
        <Route path="redux-demo" component={requireAuth(DemoPage)} />
        <Route path="task" component={requireAuth(TaskPage)} />
        <Route path="pto" component={requireAuth(PTOPage)}>
          <IndexRoute component={requireAuth(PTOApplication)} />
          <Route path="overtime" component={requireAuth(PTOOvertime)} />
          <Route path="summary" component={requireAuth(PTOSummary)} />
        </Route>

        {/*Bug Analysis*/}
        <Route path="bug-analysis" component={requireAuth(BugAnalysisPage)}>
          <Route path="bug-analysis" component={requireAuth(BugReviewPage)} /> {/*-- Root Causes*/}
          <Route path="bug-report" component={requireAuth(BugReportPage)} /> {/*-- Analysis Reports*/}
        </Route>

        {/* resource*/}
        <Route path="resource" component={requireAuth(ResourcePage)}>
          <Route path="resource-map" component={requireAuth(ResourceMapPage)} />
          <Route path="team" component={requireAuth(TeamMemberPage)} />
        </Route>
        <Route path="valid-demo" component={requireAuth(ValidDemoPage)} />

        {/* Knowlege base*/}
        <Route path="knowledge" component={requireAuth(KnowledgePage)}>
          <Route path="document/edit/:articleId" component={requireAuth(EditArticlePage)} />
          <Route path="document/markdown-cheatsheet" component={requireAuth(MarkdownCheatSheet)} />
          <Route path="document/:articleId" component={requireAuth(ViewArticlePage)} />
          <Route path="document" component={requireAuth(DocumentPage)} />
          <Route path="bug-tracking" component={requireAuth(BugTrackingPage)} />
        </Route>

        {/* feature-analysis base*/}
        <Route path="feature-analysis" component={requireAuth(FeatureAnalysisPage)}>
          <IndexRoute component={requireAuth(FeatureAnalysisTreePage)} />
          <Route path="table" component={requireAuth(FeatureAnalysisTablePage)} />
        </Route>

        {/* data-explorer base*/}
        <Route path="data-explorer" component={requireAuth(DataExplorerPage)}>
          <IndexRoute component={requireAuth(DataExplorerFolderView)}/>
          <Route path="data-explorer/:folderName" component={requireAuth(DataExplorerFileView)} />
        </Route>

      </Route>
      <Route path="*" component={NotFoundPage} />
    </Route>
  </Router>
);

export default appRoutes;
