// Styles
import './assets/styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table/css/react-bootstrap-table.min.css';
import '../node_modules/material-design-lite/material.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css';
// Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// Store
import configureStore from './store/configureStore';
// Routes
import appRoutes from './routes/appRoutes';

const store = configureStore();

ReactDOM.render(
	<Provider store={store}>
	    {appRoutes(store)}
	</Provider>,
	document.getElementById('root')
);
