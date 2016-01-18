// Styles
import './_App.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Component
import Spinner from '../../components/Spinner/Spinner';
// Actions
import * as AppActions from '../../actions/app-actions';
import * as MainActions from '../../actions/main-actions';

class App extends Component {
	componentWillMount() {
		const {	getCurrentUser } = this.props.appActions;
		getCurrentUser();
	}
	render() {
		const {
			isLoading
		} = this.props.mainState;
		return (
			<div>
				<Spinner hide={!isLoading} />
				{this.props.children}
			</div>
		);
	}
}

App.propTypes = {
	appState  : PropTypes.object.isRequired,
	mainState :PropTypes.object.isRequired,
	appActions: PropTypes.object.isRequired,
	mainActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return {
		appState: state.app.toJS(),
		mainState: state.main.toJS(),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		appActions : bindActionCreators(AppActions, dispatch),
		mainActions: bindActionCreators(MainActions, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
