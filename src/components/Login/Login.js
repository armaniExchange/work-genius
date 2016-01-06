// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
// Styles
import './_Login.scss';

class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		};
		this._onHandleUsernameChange = ::this._onHandleUsernameChange;
		this._onHandlePasswordChange = ::this._onHandlePasswordChange;
		this._onSubmitHandle = ::this._onSubmitHandle;
	}

    _onHandleUsernameChange(e) {
    	this.setState({username: e.target.value});
    }

    _onHandlePasswordChange(e) {
    	this.setState({password: e.target.value});
    }

    _onSubmitHandle(e) {
    	e.preventDefault();
		const {
			onSubmitHandler
		} = this.props;
		onSubmitHandler({
			username: this.state.username,
			password: this.state.password
		});
    }

	render() {
		const { error } = this.props;
		let warningClass = classnames({
			'error-message': true,
			'text-danger'  : true,
			'hide'         : !error
		});
		return (
	        <form className="form-signin" onSubmit={this._onSubmitHandle}>
		        <h4 className="form-signin-heading">Sign in Work Genius</h4>
		        <input
		            type="text"
		            className="input-block-level"
		            value={this.state.username}
		            onChange={this._onHandleUsernameChange}
		            placeholder="Username" />
		        <input
		            type="password"
		            className="input-block-level"
		            value={this.state.password}
		            onChange={this._onHandlePasswordChange}
		            placeholder="Password" />
		        <div className={warningClass}>{this.props.error}</div>
		        <button
		            className="btn btn-large btn-primary"
		            type="submit">
		            Sign in
		        </button>
	        </form>
		);
	}
}

LoginForm.propTypes = {
	error          : PropTypes.string,
	onSubmitHandler: PropTypes.func
};

LoginForm.defaultProps = {
	error          : '',
	onSubmitHandler: () => {}
};

export default LoginForm;
