// Libraries
import React from 'react';
import Router, { Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
// Components
import App from '../containers/App/App';
import DashboardPage from '../containers/DashboardPage/DashboardPage';
import TaskPage from '../containers/TaskPage/TaskPage';
import PTOPage from '../containers/PTOPage/PTOPage';

// Demo Component (To be removed)
import DemoPage from '../containers/DemoPage/DemoPage';
import Login from '../containers/Login/Login';

const appRoutes = (
	<Router history={createBrowserHistory()}>
		<Route path="/login" component={Login} />
		<Route component={App}>
		    <Route path="/" component={DashboardPage} />
		    <Route path="/task" component={TaskPage} />
		    <Route path="/pto" component={PTOPage} />
		    <Route path="/redux-demo" component={DemoPage} />
		</Route>
	</Router>
);

export default appRoutes;
