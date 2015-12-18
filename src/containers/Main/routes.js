/**
 * App routes.
 * @author Howard, Roll
 */

// Libraries
import React from 'react';
import Router, { Route, IndexRoute, Redirect } from 'react-router';

// Container
import Main from './containers/Main/Main';

// Container routes
import dashboardPageRoutes from '../containers/DashboardPage/routes';
import taskPageRoutes from '../containers/TaskPage/routes';
import PTOPage from './containers/PTOPage/PTOPage';
import DataExplorerPage from './containers/DataExplorerPage/DataExplorerPage';
import DataExplorerFolderView from './containers/DataExplorerFolderView/DataExplorerFolderView';
import DataExplorerFileView from './containers/DataExplorerFileView/DataExplorerFileView';
import Login from './containers/Login/Login';
import NotFoundPage from './containers/NotFoundPage/NotFoundPage';

// Utilities
import { requireAuth } from '../common/routeUtilities';

export default (
    <Route component={Main} onEnter={requireAuth}>
        {
        // <IndexRoute component={DashboardPage} onEnter={requireAuth}/>
        }
        <Route path="dashboard">{dashboardPageRoutes}</Route>
        <Route path="task">{taskPageRoutes}</Route>
        <Route path="pto" component={PTOPage} onEnter={requireAuth} />
        <Route path="redux-demo" component={DemoPage} onEnter={requireAuth} />
        <Route path="data-explorer" component={DataExplorerPage} onEnter={requireAuth}>
            <IndexRoute component={DataExplorerFolderView} onEnter={requireAuth}/>
            <Route path="data-explorer/:folderName" component={DataExplorerFileView} onEnter={requireAuth} />
        </Route>
    </Route>
);
