// Libraries
import React from 'react';
import Router, { Route, IndexRoute } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
// Components
import App from '../containers/App/App';
import Main from '../containers/Main/Main';
import AdminPage from '../containers/AdminPage/AdminPage';
import ValidDemoPage from '../containers/ValidDemoPage/ValidDemoPage';
import DashboardPage from '../containers/DashboardPage/DashboardPage';
import TaskPage from '../containers/TaskPage/TaskPage';
import PTOPage from '../containers/PTOPage/PTOPage';
import BugReviewPage from '../containers/BugReviewPage/BugReviewPage';
import BugReportPage from '../containers/BugReportPage/BugReportPage';
import ResourceMapPage from '../containers/ResourceMapPage/ResourceMapPage.js';
import DataExplorerPage from '../containers/DataExplorerPage/DataExplorerPage';
import DataExplorerFolderView from '../containers/DataExplorerFolderView/DataExplorerFolderView';
import DataExplorerFileView from '../containers/DataExplorerFileView/DataExplorerFileView';
import Login from '../containers/Login/Login';
import NotFoundPage from '../containers/NotFoundPage/NotFoundPage';
import DocumentPage from '../containers/DocumentPage/DocumentPage';
import EditArticlePage from '../containers/EditArticlePage/EditArticlePage';
import ViewArticlePage from '../containers/ViewArticlePage/ViewArticlePage';
import FeatureAnalysisPage from '../containers/FeatureAnalysisPage/FeatureAnalysisPage';
import FeatureAnalysisTreePage from '../containers/FeatureAnalysisPage/FeatureAnalysisTree';
import FeatureAnalysisTablePage from '../containers/FeatureAnalysisPage/FeatureAnalysisTable';

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
			    <Route path="admin" component={requireAuth(AdminPage)} />
			    <Route path="task" component={requireAuth(TaskPage)} />
			    <Route path="pto" component={requireAuth(PTOPage)} />
			    <Route path="redux-demo" component={requireAuth(DemoPage)} />
				<Route path="bug-analysis" component={requireAuth(BugReviewPage)} />
				<Route path="bug-report" component={requireAuth(BugReportPage)} />
				<Route path="resource-map" component={requireAuth(ResourceMapPage)} />
				<Route path="valid-demo" component={requireAuth(ValidDemoPage)} />
		        <Route path="articles/edit/:articleId" component={requireAuth(EditArticlePage)} />
		        <Route path="articles/:articleId" component={requireAuth(ViewArticlePage)} />
		        <Route path="document" component={requireAuth(DocumentPage)} />
				<Route path="feature-analysis" component={requireAuth(FeatureAnalysisPage)}>
				    <IndexRoute component={requireAuth(FeatureAnalysisTreePage)} />
					<Route path="table" component={requireAuth(FeatureAnalysisTablePage)} />
				</Route>
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
