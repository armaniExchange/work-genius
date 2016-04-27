// Styles
import './assets/styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table/css/react-bootstrap-table.min.css';
import '../node_modules/material-design-lite/material.css';
import '../node_modules/material-design-lite/material.min.js';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css';
import './components/A10-UI/a10-mdl.css'; //override getmdl.com css for our purpose
// Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
// Store
import configureStore from './store/configureStore';
// Routes
import appRoutes from './routes/appRoutes';

const store = configureStore();

injectTapEventPlugin();

ReactDOM.render(
	<Provider store={store}>
	    {appRoutes(store)}
	</Provider>,
	document.getElementById('root')
);
