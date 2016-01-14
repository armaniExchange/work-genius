// Libraries
import React from 'react';
import Router, { Route, IndexRoute } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
// Components
import App from '../containers/App/App';
import Main from '../containers/Main/Main';
import DashboardPage from '../containers/DashboardPage/DashboardPage';
import TaskPage from '../containers/TaskPage/TaskPage';
import PTOPage from '../containers/PTOPage/PTOPage';
import DataExplorerPage from '../containers/DataExplorerPage/DataExplorerPage';
import DataExplorerFolderView from '../containers/DataExplorerFolderView/DataExplorerFolderView';
import DataExplorerFileView from '../containers/DataExplorerFileView/DataExplorerFileView';
import Login from '../containers/Login/Login';
import NotFoundPage from '../containers/NotFoundPage/NotFoundPage';
// Utilities
import requireAuth from '../containers/Require-Auth/Require-Auth';

// Demo Component (To be removed)
import DemoPage from '../containers/DemoPage/DemoPage';

const appRoutes = () => (
	<Router history={createBrowserHistory()}>
	    <Route path="/" component={App}>
			<IndexRoute component={Login} />
			<Route path="/main" component={requireAuth(Main)}>
			    <IndexRoute component={DashboardPage}/>
			    <Route path="/main/task" component={TaskPage} />
			    <Route path="/main/pto" component={PTOPage} />
			    <Route path="/main/redux-demo" component={DemoPage} />
			    <Route path="/main/data-explorer" component={DataExplorerPage}>
			        <IndexRoute component={DataExplorerFolderView}/>
			        <Route path="/main/data-explorer/:folderName" component={DataExplorerFileView} />
			    </Route>
		    </Route>
		    <Route path="*" component={NotFoundPage} />
		</Route>
	</Router>
);

export default appRoutes;
