/**
 * Dashboard page routes.
 * @author Roll
 */

// Libraries
import React from 'react';
import { Route, IndexRoute } from 'react-router';

// Container
import TaskPage from './TaskPage';

// Utilities
import { requireAuth } from '../common/routeUtilities';

export default (
    <Route>
        <IndexRoute component={TaskPage} onEnter={requireAuth} />
    </Route>
);
