// Styles
import './_App.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// Components
import Navigation from '../../components/Navigation/Navigation';
import PageHeader from '../../components/Page-Header/Page-Header';

class App extends Component {
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
			return item.link === pathName;
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
		} = this.props.appState;

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
					    onNavItemsClick={this._navItemsClickHandler.bind(this)} />
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

App.propTypes = {
	appState: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return {
		appState: state.app.toJS()
	};
}

export default connect(
	mapStateToProps
)(App);
