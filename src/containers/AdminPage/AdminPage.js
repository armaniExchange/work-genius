// Style
import './AdminPage.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// Constants
import { PRIVILEGE } from '../../constants/config.js';

class AdminPage extends Component {
	componentDidMount() {
		const { currentUser } = this.props;
		if (currentUser.privilege < PRIVILEGE.ADMIN) {
			this.context.history.push({
				path: '/main'
			});
		}
	}
	render() {
		return (
			<section>Admin Page</section>
		);
	}
}

AdminPage.propTypes = {
    currentUser: PropTypes.object
};

AdminPage.contextTypes = {
    location: PropTypes.object,
    history: PropTypes.object
};

function mapStateToProps(state) {
    return Object.assign(
        {},
        state.app.toJS()
    );
}

function mapDispatchToProps() {
    return Object.assign(
        {}
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminPage);
