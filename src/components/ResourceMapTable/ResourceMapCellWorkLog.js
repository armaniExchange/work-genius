import './ResourceMapTable.css';
import React, { Component } from 'react';

class ResourceMapCellWorkLog extends Component {

	render() {
		return (
			<div>
				<label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor="checkbox-2">
				  <input type="checkbox" id="checkbox-2" className="mdl-checkbox__input" />
				  <span className="label-default-style mdl-checkbox__label">30% fix 300213</span>
				</label>
				<label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor="checkbox-3">
				  <input type="checkbox" id="checkbox-3" className="mdl-checkbox__input" />
				  <span className="label-default-style mdl-checkbox__label">30% fix 300213</span>
				</label>
			</div>
		);
	}
}

export default ResourceMapCellWorkLog;