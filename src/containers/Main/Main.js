// Styles
import './_Main.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Components
import Navigation from '../../components/Navigation/Navigation';
import PageHeader from '../../components/Page-Header/Page-Header';
// Actions
import * as AppActions from '../../actions/app-actions';

class Main extends Component {
	componentDidUpdate() {
		/* eslint-disable */
		/* component handler is used by Material Design Lite, every react component
		   needs to upgrade its DOM in order to maintain the effect.
		*/
		componentHandler.upgradeDom();
		/* eslint-enable */
	}

	_mapPathNameToDisplayName(pathName, navItems) {
		let filteredItems = navItems.filter((item) => {
			return item.link === pathName.replace(/\/$/, '');
		});
		return filteredItems[0].displayText;
	}

	_navItemsClickHandler() {
		// console.log(name, index);
	}

	render() {
		const {
			navHeaderTitle,
			navItems,
			hasLogo
		} = this.props.mainState;

		const { logout } = this.props.appActions;

		// Location props are coming from react router
		const { pathname } = this.props.location;

		return (
			// The outer-most <div> is used by Material Design Lite to prevent DOM clash with React
			<div>
				<section className="mdl-layout mdl-js-layout mdl-layout--fixed-drawer">
					<Navigation
					    headerTitle={navHeaderTitle}
					    navItems={navItems}
					    hasLogo={hasLogo}
					    onNavItemsClick={this._navItemsClickHandler.bind(this)}
					    onLogoutHandler={logout} />
					<PageHeader headerTitle={this._mapPathNameToDisplayName(pathname, navItems)} />
					<main className="mdl-layout__content">
					    <div className="page-content">
							{this.props.children}
					    </div>
					</main>
				</section>
			</div>
		);
	}
}

Main.propTypes = {
	mainState : PropTypes.object.isRequired,
	appActions: PropTypes.object.isRequired,
	location  : PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return {
		mainState: state.main.toJS()
	};
}

function mapDispatchToProps(dispatch) {
	return {
		appActions: bindActionCreators(AppActions, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Main);
