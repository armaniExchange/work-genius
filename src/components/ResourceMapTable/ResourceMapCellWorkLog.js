import './ResourceMapTable.css';
import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/lib/checkbox';

// class ResourceMapCellWorkLog extends Component {

// 	render() {
// 		const {
// 			config
// 		} = this.props;
// 		console.log(config);
// 		var items = config.worklog_items;
// 		var worklogHtml = items.map((item, index) => {
// 			console.log(index);
// 			console.log(item);
// 			return (
// 				<div className="cell-top-item-inner-text bgm-deeppurple">
// 					<label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor="checkbox-3">
// 					  <input type="checkbox" id="checkbox-3" className="mdl-checkbox__input" />
// 					  <span className="label-default-style mdl-checkbox__label c-white">{item.content}</span>
// 					</label>
// 				</div>
// 			);
// 		});
// 		return (
// 			<div className="cell-top-item" >
// 				{worklogHtml}
// 				<br/>
// 			</div>
// 		);
// 	}
// }


const TAG = 'bgm-teal';

class ResourceMapCellWorkLog extends Component {

	constructor() {
		super();
		this._onClickWorkLogItem = ::this._onClickWorkLogItem;
	}

	_onClickWorkLogItem(item) {
		const { config, onModalHander } = this.props;
		item.userId = config.userId;
		item.date = config.date;
		onModalHander(true, item);
	}


	render() {
		const {
			config
		} = this.props;
		var items = config.worklog_items;
		var worklogHtml = items.map((item, index) => {

			let __onClickWorkLogItem = (e) => {
				e.stopPropagation();
				console.log(item);
				this._onClickWorkLogItem(item);
			};

			let className = 'worklog-layout--text ';

			className += item.tag ? item.tag : TAG;
			item.process = item.process ? item.process : 0;

			return (
				<div className="cell-top-item-inner-text" key={index}>
					<div className="worklog-layout--checkbox">
						<Checkbox className="checkbox-layout" />
					</div>
					<div className={className} onClick={__onClickWorkLogItem}>
					    <span className="label-default-style c-white">{item.process}% {item.content}</span>
					</div>
				</div>
			);
		});
		return (
			<div className="cell-top-item" >
				{worklogHtml}
				<br/>
			</div>
		);
	}
}

ResourceMapCellWorkLog.propTypes = {
	config: PropTypes.object.isRequired,
	onModalHander: PropTypes.func.isRequired
};

ResourceMapCellWorkLog.defaultProps = {
	config: {},
	onModalHander: () => {}
};

export default ResourceMapCellWorkLog;