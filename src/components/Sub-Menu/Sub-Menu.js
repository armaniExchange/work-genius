// Styles
import './_Sub-Menu.css';

// Libraries
import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/lib/text-field';
import { Link } from 'react-router';

class SubMenu extends Component {
	render () {
		const { data, headerTitle } = this.props;
		let linkHtml = data.map(({ name, url }, i) => {
			url = url ? url : '/';
			return (
				<span className="mdl-navigation__link" key={`submenu-${i}`}>
				    <Link
					    className="mdl-navigation__link__tag"
						activeClassName="mdl-navigation__link__tag--active"
						to={url}
						key={i}
						onlyActiveOnIndex={url.split('/').length <= 3}>
						    {name}
					</Link>
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

          <div className="search-box">
            <TextField
              hintText="Search..." />
            <i className="material-icons" title="Search">search</i>
          </div>

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
