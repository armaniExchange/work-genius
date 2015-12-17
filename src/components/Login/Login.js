// React & Redux
import React, { Component, PropTypes } from 'react';
// Styles
import './_Login.scss';

class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
		  	usernameError:'',
		  	passwordError: ''
		};
		this._onHandleUsernameChange = ::this._onHandleUsernameChange;
		this._onHandlePasswordChange = ::this._onHandlePasswordChange;
		this._onSubmitHandle = ::this._onSubmitHandle;
	}

    _onHandleUsernameChange(e) {
    	if (e.target.value) {
    		this.setState({username: e.target.value});
    	} else {
    		this.setState({usernameError:'Username is not right'});
    	}
    }

    _onHandlePasswordChange(e) {
    	if (e.target.value) {
    		this.setState({password: e.target.value});
    	}
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
		return (
	        <form className="form-signin" onSubmit={this._onSubmitHandle}>
	        	<i className="logo"></i>
		        <h5 className="form-signin-heading">Sign in Work Genius</h5>
		        <div className="mdl-textfield mdl-js-textfield">
			        <input
			            type="text"
			            className="mdl-textfield__input"
			            value={this.state.username}
			            ref="username"
			            onChange={this._onHandleUsernameChange}
			            placeholder="Username" />
			        <input
			            type="password"
			            className="mdl-textfield__input"
			            value={this.state.password}
			            ref="password"
			            onChange={this._onHandlePasswordChange}
			            placeholder="Password" />
			    </div>

			    <div className="mdl-textfield mdl-js-textfield text-centerized">
					<button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect">
					  Login
					</button>
				</div>
	        </form>
		);
	}
}

LoginForm.propTypes = {
	onSubmitHandler: PropTypes.func
};

LoginForm.defaultProps = {
	onSubmitHandler: () => {}
};

export default LoginForm;
