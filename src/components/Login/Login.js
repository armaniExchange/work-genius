// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Actions
import * as UserActions from '../../actions/user-actions';

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
			handleLogin
		} = this.props.loginPageActions;
		handleLogin({
			username: this.state.username,
			password: this.state.password
		});    	
    }

	render() {
		return (
	      <form className="form-signin" onSubmit={this._onSubmitHandle} >
	        <h4 className="form-signin-heading">Sign in Work Genius</h4>
	        <input type="text" className="input-block-level" value={this.state.username} ref="username" onChange={this._onHandleUsernameChange} placeholder="Username" />
	        <input type="password" className="input-block-level" value={this.state.password} ref="password" onChange={this._onHandlePasswordChange} placeholder="Password" />
	        <button className="btn btn-large btn-primary" type="submit">Sign in</button>
	      </form>
		);
	}
}

LoginForm.propTypes = {
	// headerTitle:'',
	loginPageState: PropTypes.object.isRequired,
	loginPageActions: PropTypes.object.isRequired
	// handleLogin: PropTypes.func
	// navItems: PropTypes.array.isRequired
};

// LoginForm.defaultProps = {
// 	headerTitle: 'LoginForm',
// 	hasLogo: false,
// 	handleLogin: () => {}
// };


function mapStateToProps(state) {
	return {
		loginPageState: state.user.toJS()
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loginPageActions: bindActionCreators(UserActions, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LoginForm);

