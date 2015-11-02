// Styles
import './_Navigation.scss';
// Libraries
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

// Stateless functional components
let HeaderLogo = () => {
	return (
		<span className="navigation__header-logo"></span>
	);
};

class Navigation extends Component {
	_onNavItemsClick(e) {
		const { onNavItemsClick } = this.props;
		let nameIndexCombo = e.target.name.split('-'),
		    name = nameIndexCombo[0],
		    index = nameIndexCombo[1];

		onNavItemsClick (name, index);
	}

	render() {
		const { headerTitle, navItems, hasLogo } = this.props;
		let headerLogoHtml = hasLogo ? <HeaderLogo /> : null;
		let navItemsHtml = navItems.map((item, index) => {
			return (
				<Link
				    className="mdl-navigation__link"
				    to={item.link}
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
			</div>
		);
	}
}

Navigation.propTypes = {
	headerTitle: PropTypes.string,
	hasLogo: PropTypes.bool,
	onNavItemsClick: PropTypes.func,
	navItems: PropTypes.array.isRequired
};

Navigation.defaultProps = {
	headerTitle: '',
	hasLogo: false,
	onNavItemsClick: () => {}
};

export default Navigation;
