// Style
import './_Login';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Components
import LoginForm from '../../components/Login/Login';
// Actions
import * as UserActions from '../../actions/user-actions';

class Login extends Component {
	render() {
		const { handleLogin } = this.props.loginPageActions;
		return (
		    <div className="container">
		    	<LoginForm
		    	    onSubmitHandler={handleLogin}/>
		    </div>
		);
	}
}

Login.propTypes = {
	loginPageState: PropTypes.object.isRequired,
	loginPageActions: PropTypes.object.isRequired
};

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
)(Login);
