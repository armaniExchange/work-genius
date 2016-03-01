// Styles
import './_Navigation.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
// Components
import LogoutButton from '../Logout-Button/Logout-Button';

// Stateless functional components
let HeaderLogo = () => {
	return (
		<span className="navigation__header-logo"></span>
	);
};

class Navigation extends Component {
	constructor(props) {
		super(props);
		this._onNavItemsClick = ::this._onNavItemsClick;
		this._onLogoutHandler = ::this._onLogoutHandler;
	}

	_onNavItemsClick(e) {
		const { onNavItemsClick } = this.props;
		let nameIndexCombo = e.target.name.split('-'),
		    name = nameIndexCombo[0],
		    index = nameIndexCombo[1];

		onNavItemsClick (name, index);
	}

	_onLogoutHandler() {
		const { onLogoutHandler } = this.props;
		onLogoutHandler();
	}

	render() {
		const { headerTitle, navItems, hasLogo } = this.props;
		let headerLogoHtml = hasLogo ? <HeaderLogo /> : null,
		    navItemsHtml = navItems.map((item, index) => {
				return (
					<Link
					    className="mdl-navigation__link"
					    to={item.link}
						onlyActiveOnIndex={item.link === '/main'}
						activeClassName="navigation__link--active"
					    key={`navItem${index}`}
					    name={`${item.displayText}-${index}`}
					    onClick={this._onNavItemsClick.bind(this)}>
					    {item.displayText}
					</Link>
				);
			});

		return (
			<div className="mdl-layout__drawer">
			    <span className="mdl-layout-title">
				    { headerLogoHtml }
				    <span className="navigation__header-title">{ headerTitle }</span>
				</span>
				<nav className="mdl-navigation">
					{ navItemsHtml }
				</nav>
				<LogoutButton onClickHandler={this._onLogoutHandler} />
			</div>
		);
	}
}

Navigation.propTypes = {
	navItems       : PropTypes.array.isRequired,
	headerTitle    : PropTypes.string,
	hasLogo        : PropTypes.bool,
	onNavItemsClick: PropTypes.func,
	onLogoutHandler: PropTypes.func,
};

Navigation.defaultProps = {
	headerTitle    : '',
	hasLogo        : false,
	onNavItemsClick: () => {},
	onLogoutHandler: () => {}
};

export default Navigation;
