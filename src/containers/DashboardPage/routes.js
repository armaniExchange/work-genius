/**
 * Dashboard page routes.
 * @author Roll
 */

// Libraries
import React from 'react';
import { Route, IndexRoute } from 'react-router';

// Container
import DashboardPage from './DashboardPage';

// Utilities
import { requireAuth } from '../common/routeUtilities';

export default (
    <Route>
        <IndexRoute component={DashboardPage} onEnter={requireAuth} />
        {
            // test...
        }
        <Route path="test" component={DashboardPage} onEnter={requireAuth} />
    </Route>
);
