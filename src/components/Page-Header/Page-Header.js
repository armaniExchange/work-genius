// Styles
import './_Page-Header.css';

// Libraries
import React, { Component, PropTypes } from 'react';

class PageHeader extends Component {
	render () {
		const { headerTitle } = this.props;

		return (
			<header className="mdl-layout__header mdl-layout__header--level2">
			    <div className="mdl-layout__header-row">
			        <span className="mdl-layout-title">{headerTitle}</span>
				    <div className="mdl-layout-spacer"></div>
			    </div>
			</header>
		);
	}
}

PageHeader.propTypes = {
	headerTitle: PropTypes.string
};

PageHeader.defaultProps = {
	headerTitle: ''
};

export default PageHeader;
