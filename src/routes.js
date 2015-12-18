/**
 * App routes.
 * @author Howard, Roll
 */

// Libraries
import React from 'react';
import Router, { Route, IndexRoute, Redirect } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

// App container
import App from './containers/App/App';

// Container routes
import mainRoutes from './containers/Main/routes';

import Login from './containers/Login/Login';
import NotFoundPage from './containers/NotFoundPage/NotFoundPage';

// Utilities
import { requireAuth, redirectIfAuthorized } from './common/routeUtilities';

// Demo Component (To be removed)
import DemoPage from './containers/DemoPage/DemoPage';

const appRoutes = (
    <Router history={createBrowserHistory()}>
        {
        // <Route path="/" component={App}>
        }
        <Route component={App}>
            {mainRoutes}
            <Route path="/login" component={Login} onEnter={redirectIfAuthorized} />
            <Redirect from="/" to="dashboard" />
            <Route path="*" component={NotFoundPage} />
        </Route>
    </Router>
);

export default appRoutes;
