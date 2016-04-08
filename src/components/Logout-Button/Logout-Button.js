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
	            className="btn btn-large btn-primary"
              onClick={this.props.onClickHandler}>
	            Log out
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
