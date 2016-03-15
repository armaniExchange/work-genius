// Style
import './AdminPage.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Actions
import * as adminActions from '../../actions/admin-page-actions';
// Constants
import { PRIVILEGE } from '../../constants/config.js';

import PrivilegeTable from '../../components/Privilege-Table/Privilege-Table';

class AdminPage extends Component {
	componentDidMount() {
		const { currentUser, fetchUsersWithPrivilege } = this.props;
		if (currentUser.privilege < PRIVILEGE.ADMIN) {
			this.context.history.push({
				path: '/main'
			});
		}
		fetchUsersWithPrivilege();
	}
	render() {
		const { usersWithPrivilege , updateUserPrivilege} = this.props;
		return (
		<section>
            <h1>Admin Page</h1>
            <PrivilegeTable
                updateUserPrivilege={ updateUserPrivilege }
                titleKeyMap={['privilege']}
                data={usersWithPrivilege}/>
          </section>
		);
	}
}

AdminPage.propTypes = {
    currentUser            : PropTypes.object,
    usersWithPrivilege     : PropTypes.array,
    fetchUsersWithPrivilege: PropTypes.func,
    updateUserPrivilege    : PropTypes.func
};

AdminPage.contextTypes = {
    location: PropTypes.object,
    history: PropTypes.object
};

function mapStateToProps(state) {
    return Object.assign(
        {},
        state.app.toJS(),
        state.admin.toJS()
    );
}

function mapDispatchToProps(dispatch) {
    return Object.assign(
        {},
        bindActionCreators(adminActions, dispatch)
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminPage);
