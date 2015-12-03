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
import Login from '../containers/Login/Login';
// Utilities
import { requireAuth, redirectIfAuthorized } from './routeUtilities';

// Demo Component (To be removed)
import DemoPage from '../containers/DemoPage/DemoPage';

const appRoutes = (
	<Router history={createBrowserHistory()}>
	    <Route path="/" component={App}>
			<IndexRoute component={Login} onEnter={redirectIfAuthorized}/>
			<Route path="/main" component={Main} onEnter={requireAuth}>
			    <IndexRoute component={DashboardPage} onEnter={requireAuth}/>
			    <Route path="/main/task" component={TaskPage} onEnter={requireAuth} />
			    <Route path="/main/pto" component={PTOPage} onEnter={requireAuth} />
			    <Route path="/main/redux-demo" component={DemoPage} onEnter={requireAuth} />
		    </Route>
		</Route>
	</Router>
);

export default appRoutes;
