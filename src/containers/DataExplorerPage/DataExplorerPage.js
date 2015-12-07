// Style
import './_DataExplorerPage';
// React & Redux
import React, { Component } from 'react';

class DataExplorerPage extends Component {
	render() {
		return (
			<div className="data-explorer">
				{this.props.children}
			</div>
		);
	}
}

export default DataExplorerPage;
