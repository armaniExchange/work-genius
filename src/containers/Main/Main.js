// Styles
import './_Main.css';
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
		this._navItemsClickHandler = ::this._navItemsClickHandler;
		this._mapPathNameToDisplayName = ::this._mapPathNameToDisplayName;
	}

	_mapPathNameToDisplayName(pathName, navItems) {
		var re = /main\/([a-zA-Z0-9-_]*)\/?/i;
		let titleMatchResult = pathName.match(re),
		    titleFromPath = titleMatchResult ? titleMatchResult[1] : titleMatchResult,
			filteredItems = navItems.filter((item) => {
				let itemMatchResult = item.link.match(re),
					titleFromItem = itemMatchResult ? itemMatchResult[1] : itemMatchResult;
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
			<section className="mdl-layout mdl-js-layout">
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
				    onNavItemsClick={this._navItemsClickHandler}
				    onLogoutHandler={logout} />
				<PageHeader headerTitle={this._mapPathNameToDisplayName(pathname, navItems)} />
				<main className="mdl-layout__content">
				    <div className="page-content">
						{this.props.children}
				    </div>
				</main>
			</section>
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
