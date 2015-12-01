// Libraries
import React from 'react';
import Router, { Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
// Components
import App from '../containers/App/App';
import DashboardPage from '../containers/DashboardPage/DashboardPage';
import TaskPage from '../containers/TaskPage/TaskPage';
import PTOPage from '../containers/PTOPage/PTOPage';
import Login from '../containers/Login/Login';

// Demo Component (To be removed)
import DemoPage from '../containers/DemoPage/DemoPage';

const appRoutes = (
	<Router history={createBrowserHistory()}>
		<Route path="/" component={Login} />
		<Route component={App}>
		    <Route path="/dashboard" component={DashboardPage} />
		    <Route path="/task" component={TaskPage} />
		    <Route path="/pto" component={PTOPage} />
		    <Route path="/redux-demo" component={DemoPage} />
		</Route>
	</Router>
);

export default appRoutes;
