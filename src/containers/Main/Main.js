// Styles
import './_Main.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Components
import Navigation from '../../components/Navigation/Navigation';
import PageHeader from '../../components/Page-Header/Page-Header';
import AlertBox from '../../components/AlertBox/AlertBox';
// Actions
import * as AppActions from '../../actions/app-actions';
import * as MainActions from '../../actions/main-actions';

class Main extends Component {
	constructor(props) {
		super(props);
		this._closeAlertBox = ::this._closeAlertBox;
	}

	componentDidUpdate() {
		/* eslint-disable */
		/* component handler is used by Material Design Lite, every react component
		   needs to upgrade its DOM in order to maintain the effect.
		*/
		componentHandler.upgradeDom();
		/* eslint-enable */
	}

	_mapPathNameToDisplayName(pathName, navItems) {
		var re = /main\/([a-zA-Z0-9-_]*)\/?/i;
		let titleMatchResult = pathName.match(re);
		let titleFromPath = titleMatchResult ? titleMatchResult[1] : titleMatchResult;
		let filteredItems = navItems.filter((item) => {
			let itemMatchResult = item.link.match(re);
			let titleFromItem = itemMatchResult ? itemMatchResult[1] : itemMatchResult;
			return titleFromItem === titleFromPath;
		});
		return filteredItems.length === 0 ? '' : filteredItems[0].displayText;
	}

	_navItemsClickHandler() {
		// console.log(name, index);
	}

	_closeAlertBox() {
		const {
			errorMessage
		} = this.props.appState;
		if (errorMessage.toLowerCase() === 'unauthorized') {
			location.reload();
		}
		this.props.appActions.clearErrorMessage();
	}

	render() {
		const {
			navHeaderTitle,
			navItems,
			hasLogo
		} = this.props.mainState;
		const {
			errorMessage
		} = this.props.appState;
		const { logout } = this.props.appActions;

		// Location props are coming from react router
		const { pathname } = this.props.location;

		return (
			// The outer-most <div> is used by Material Design Lite to prevent DOM clash with React
			<div>
				<section className="mdl-layout mdl-js-layout mdl-layout--fixed-drawer">
					<AlertBox
						type="error"
					    show={!!errorMessage}
					    message={errorMessage}
					    onHideHandler={this._closeAlertBox}
					    onConfirmHandler={this._closeAlertBox} />
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
	mainState  : PropTypes.object.isRequired,
	appState   : PropTypes.object.isRequired,
	appActions : PropTypes.object.isRequired,
	mainActions: PropTypes.object.isRequired,
	location   : PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return {
		mainState: state.main.toJS(),
		appState: state.app.toJS()
	};
}

function mapDispatchToProps(dispatch) {
	return {
		appActions : bindActionCreators(AppActions, dispatch),
		mainActions: bindActionCreators(MainActions, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Main);
