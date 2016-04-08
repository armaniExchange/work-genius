// Styles
import './_Sub-Menu.css';

// Libraries
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class SubMenu extends Component {
	render () {
		const { data, headerTitle } = this.props;
		let linkHtml = data.map(({ name, url }, i) => {
			url = url ? url : '/';
			return (
				<span className="mdl-navigation__link" key={`submenu-${i}`}>
				    <Link to={url} key={i}>{name}</Link>
				</span>
			);
		});

		return (
			<header className="mdl-layout__header mdl-layout__header--level2">
			    <div className="mdl-layout__header-row">
					<span className="mdl-layout-title">{headerTitle}</span>
					<nav className="mdl-navigation">
			            {linkHtml}
					</nav>
			    </div>
			</header>
		);
	}
}

SubMenu.propTypes = {
	data       : PropTypes.array.isRequired,
	headerTitle: PropTypes.string
};

SubMenu.defaultProps = {
	headerTitle: ''
};

export default SubMenu;
