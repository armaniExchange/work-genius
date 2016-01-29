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

class App extends Component {
	componentWillMount() {
		const {	getCurrentUser } = this.props.appActions;
		getCurrentUser();
	}
	render() {
		const {
			isLoading
		} = this.props.appState;
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
	appActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return {
		appState: state.app.toJS()
	};
}

function mapDispatchToProps(dispatch) {
	return {
		appActions : bindActionCreators(AppActions, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
