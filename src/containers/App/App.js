// Styles
import './_App.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class App extends Component {
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}

App.propTypes = {
	appState  : PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return {
		appState: state.main.toJS()
	};
}

export default connect(
	mapStateToProps
)(App);
