// Styles
import '../node_modules/material-design-lite/material.min.css';
import './assets/styles/index.css';
// Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Router from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
// Store
import configureStore from './store/configureStore';
// Routes
import appRoutes from './routes/appRoutes';

const store = configureStore();

ReactDOM.render(
	<Provider store={store}>
	    <Router history={createBrowserHistory()}>{appRoutes}</Router>
	</Provider>,
	document.getElementById('root')
);
