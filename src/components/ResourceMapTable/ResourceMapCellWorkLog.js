import './ResourceMapTable.css';
import React, { Component, PropTypes } from 'react';

class ResourceMapCellWorkLog extends Component {

	render() {
		// const {
		// 	config
		// } = this.props;
		// console.log(config);
		return (
			<div className="cell-top-item" >
				<div className="cell-top-item-inner-text bgm-deeppurple">
					<label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor="checkbox-3">
					  <input type="checkbox" id="checkbox-3" className="mdl-checkbox__input" />
					  <span className="label-default-style mdl-checkbox__label c-white">30% fix 300213</span>
					</label>
				</div>
				<div className="cell-top-item-inner-text bgm-purple">
					<label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor="checkbox-2">
					  <input type="checkbox" id="checkbox-2" className="mdl-checkbox__input" />
					  <span className="label-default-style mdl-checkbox__label c-white">30% fix 300213</span>
					</label>
				</div>
				<div className="cell-top-item-inner-text bgm-blue">
					<label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor="checkbox-3">
					  <input type="checkbox" id="checkbox-3" className="mdl-checkbox__input" />
					  <span className="label-default-style mdl-checkbox__label c-white	">30% fix 300213</span>
					</label>
				</div>
			</div>
		);
	}
}

ResourceMapCellWorkLog.propTypes = {
	config: PropTypes.object.isRequired,
};

ResourceMapCellWorkLog.defaultProps = {
	config: {}
};

export default ResourceMapCellWorkLog;