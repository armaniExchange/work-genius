/**
 * @author Howard Chang
 */

// Styles
import './_Folder-Block';
// Libraries
import React, { Component, PropTypes } from 'react';
// Components
import { Link } from 'react-router';

class FolderBlock extends Component {
	constructor(props) {
		super(props);
		this._onCloseClicked = ::this._onCloseClicked;
	}

	_onCloseClicked() {
		const { title, onCloseHandler } = this.props;
		onCloseHandler(title);
	}

	render() {
		const { title, link, showCloseButton } = this.props;
		let closeButtonHTML = showCloseButton ? (
			<div className="folder-block__close-button fa fa-times" onClick={this._onCloseClicked}></div>
		) : undefined;

		return (
			<div className="folder-block">
				<Link className="folder-block__link" to={link}>
				    {title}
				</Link>
			    {closeButtonHTML}
			</div>
		);
	}
};

FolderBlock.propTypes = {
	title          : PropTypes.string.isRequired,
	link           : PropTypes.string.isRequired,
	showCloseButton: PropTypes.bool,
	onCloseHandler : PropTypes.func
};

FolderBlock.defaultProps = {
	showCloseButton: false,
	onCloseHandler : () => {}
};

export default FolderBlock;
