// React & Redux
import React, { Component, PropTypes } from 'react';
// Styles
import './_Logout-Button.css';

class LogoutButton extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
	        <button
	            onClick={this.props.onClickHandler}>
	            Sign Out
	        </button>
		);
	}
}

LogoutButton.propTypes = {
	onClickHandler: PropTypes.func
};

LogoutButton.defaultProps = {
	onClickHandler: () => {}
};

export default LogoutButton;
