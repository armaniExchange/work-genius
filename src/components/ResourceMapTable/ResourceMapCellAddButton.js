import './ResourceMapTable.css';
import React, { Component, PropTypes } from 'react';

class ResourceMapCellAddButton extends Component {

	constructor() {
		super();
		this._onClickAddButton = ::this._onClickAddButton;
	}

	_onClickAddButton() {
		const { onModalHander } = this.props;
		onModalHander(true);
	}

	render() {
		const {
			config
		} = this.props;
		console.log(config);
		// return (
		// 	<button
		// 		onClick={this._onClickAddButton}
		// 		className="add-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
		// 		data-upgraded=",MaterialButton"
		// 	>
		// 	  Add
		// 	</button>
		// );
		return (
			<div
				className={'cell-default-item'}
				onClick={this._onClickAddButton}
			/>
		);
	}
}

ResourceMapCellAddButton.propTypes = {
	config: PropTypes.object.isRequired,
	onModalHander: PropTypes.func.isRequired
};

ResourceMapCellAddButton.defaultProps = {
	config: {}
};

export default ResourceMapCellAddButton;