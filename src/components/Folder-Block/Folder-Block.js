// Styles
import './_Folder-Block';
// Libraries
import React, { Component, PropTypes } from 'react';
// Components
import { Link } from 'react-router';

class FolderBlock extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { title, link } = this.props;
		return (
			<Link
			    to={link}
			    className="FolderBlock">
			    {title}
			</Link>
		);
	}
};

FolderBlock.propTypes = {
	title: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired
};

FolderBlock.defaultProps = {};

export default FolderBlock;
