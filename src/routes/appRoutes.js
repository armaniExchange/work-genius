// Libraries
import React from 'react';
import { Route } from 'react-router';
// Components
import App from '../containers/App/App';
import DashboardPage from '../containers/DashboardPage/DashboardPage';
import TaskPage from '../containers/TaskPage/TaskPage';
import PTOPage from '../containers/PTOPage/PTOPage';

// Demo Component (To be removed)
import DemoPage from '../containers/DemoPage/DemoPage';

const appRoutes = (
	<Route component={App}>
	    <Route path="/" component={DashboardPage} />
	    <Route path="/task" component={TaskPage} />
	    <Route path="/pto" component={PTOPage} />
	    <Route path="/redux-demo" component={DemoPage} />
	</Route>
);

export default appRoutes;
