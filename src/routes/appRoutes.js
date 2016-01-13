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
import { requireAuth, redirectIfAuthorized } from './routeUtilities';

// Demo Component (To be removed)
import DemoPage from '../containers/DemoPage/DemoPage';

const appRoutes = (store) => (
	<Router history={createBrowserHistory()}>
	    <Route path="/" component={App}>
			<IndexRoute component={Login} onEnter={redirectIfAuthorized(store)}/>
			<Route path="/main" component={Main} onEnter={requireAuth(store)}>
			    <IndexRoute component={DashboardPage} onEnter={requireAuth(store)}/>
			    <Route path="/main/task" component={TaskPage} onEnter={requireAuth(store)} />
			    <Route path="/main/pto" component={PTOPage} onEnter={requireAuth(store)} />
			    <Route path="/main/redux-demo" component={DemoPage} onEnter={requireAuth(store)} />
			    <Route path="/main/data-explorer" component={DataExplorerPage} onEnter={requireAuth(store)}>
			        <IndexRoute component={DataExplorerFolderView} onEnter={requireAuth(store)}/>
			        <Route path="/main/data-explorer/:folderName" component={DataExplorerFileView} onEnter={requireAuth(store)} />
			    </Route>
		    </Route>
		    <Route path="*" component={NotFoundPage} />
		</Route>
	</Router>
);

export default appRoutes;
