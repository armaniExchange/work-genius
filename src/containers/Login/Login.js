// Style
import './_Login';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Components
import LoginForm from '../../components/Login/Login';
// Actions
import * as AppActions from '../../actions/app-actions';
import * as MainActions from '../../actions/main-actions';

class Login extends Component {
	constructor(props) {
		super(props);
		this._onLogin = ::this._onLogin;
	}
	componentWillReceiveProps(nextProps) {
		const { isAuthenticated } = nextProps.appState;
		if (isAuthenticated) {
			// console.log(this.context.history);
			// this.context.history.goBack();
			this.context.history.pushState(null, '/main');
		}
	}
	_onLogin(user) {
		const {
			login,
			loginFailure,
			loginSuccess
		} = this.props.appActions;
		const { setLoadingState } = this.props.mainActions;

		setLoadingState(true);
		login(user,
			(res) => {
				loginSuccess(
                    res.token,
                    res.user,
                    true
                );
				setLoadingState(false);
			},
			(err) => {
				loginFailure(err);
				setLoadingState(false);
			}
		);
	}
	render() {
		const { loginError } = this.props.appState;
		return (
		    <div className="container">
		    	<LoginForm
		    		error={loginError}
		    	    onSubmitHandler={this._onLogin}/>
		    </div>
		);
	}
}

Login.propTypes = {
	appState  : PropTypes.object.isRequired,
	appActions: PropTypes.object.isRequired,
	mainActions: PropTypes.object.isRequired
};

Login.contextTypes = {
    location: PropTypes.object,
    history: PropTypes.object
};

function mapStateToProps(state) {
	return {
		appState: state.app.toJS()
	};
}

function mapDispatchToProps(dispatch) {
	return {
		appActions: bindActionCreators(AppActions, dispatch),
		mainActions: bindActionCreators(MainActions, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Login);
