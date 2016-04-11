import './ResourceMapTable.css';
import React, { Component } from 'react';

class ResourceMapCellAddButton extends Component {

	render() {
		return (
			<button
				className="add-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
				data-upgraded=",MaterialButton"
			>
			  Add
			</button>
		);
	}
}

export default ResourceMapCellAddButton;