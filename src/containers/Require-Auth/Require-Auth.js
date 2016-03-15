// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Actions
import * as AppActions from '../../actions/app-actions';
import * as MainActions from '../../actions/main-actions';

export default function requireAuthentication(ProtectedComponent) {

    class AuthenticatedComponent extends Component {
        constructor(props) {
            super(props);
            this._checkAuth = ::this._checkAuth;
        }
        componentWillReceiveProps(nextProps) {
            this._checkAuth(nextProps);
        }
        _checkAuth(nextProps) {
            if (!nextProps.isAuthenticated) {
                this.context.history.pushState(null, '/');
            }
        }
        render() {
            return (
                <div>
                    {this.props.isAuthenticated === true
                        ? <ProtectedComponent {...this.props}/>
                        : null
                    }
                </div>
            );
        }
    }

    AuthenticatedComponent.propTypes = {
        isAuthenticated: PropTypes.bool,
        appActions: PropTypes.object.isRequired,
        mainActions: PropTypes.object.isRequired
    };

    AuthenticatedComponent.contextTypes = {
        location: PropTypes.object,
        history: PropTypes.object
    };

    const mapStateToProps = (state) => ({
        token: state.app.toJS().token,
        isAuthenticated: state.app.toJS().isAuthenticated
    });

    const mapDispatchToProps = (dispatch) => ({
        appActions : bindActionCreators(AppActions, dispatch),
        mainActions: bindActionCreators(MainActions, dispatch)
    });

    return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent);
}