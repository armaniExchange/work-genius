// Style
import './_Login';
// React & Redux
import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// // Actions
// import * as LoginActions from '../../actions/login-actions';
// Components
import LoginForm from '../../components/Login/Login';

class Login extends Component {
	componentWillMount() {

	}
	render() {

		return (
		    <div className="container">
		    	<LoginForm />
		    </div> 
		);
	}
}

Login.propTypes = {
	// LoginState: PropTypes.object.isRequired
// 	LoginActions: PropTypes.object.isRequired
};

// function mapStateToProps(state) {
// 	return {
// 		LoginState: state.task.toJS()
// 	};
// }

// function mapDispatchToProps(dispatch) {
// 	return {
// 		LoginActions: bindActionCreators(LoginActions, dispatch)
// 	};
// }

export default Login;
