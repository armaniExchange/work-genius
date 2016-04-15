import './ResourceMapTable.css';
import './progress-style.css';
import 'rc-tooltip/assets/bootstrap_white.css';
import 'rc-checkbox/assets/index.css';

import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
// import Tooltip from 'rc-tooltip';
import Checkbox from 'rc-checkbox';

const TAG = 'bgm-teal';

class ResourceMapCellWorkLog extends Component {

	constructor() {
		super();
		this._onClickWorkLogItem = ::this._onClickWorkLogItem;
		this._onSubmitCheckBoxItem = ::this._onSubmitCheckBoxItem;
		this._onCancelDialogHander = ::this._onCancelDialogHander;
		this._onDeleteItemHander = ::this._onDeleteItemHander;
		this.state = {open: false, selectedItem: undefined};
	}

	_onClickWorkLogItem(item) {
		const { config, onModalHander } = this.props;
		item.userId = config.userId;
		item.date = config.date;
		onModalHander(true, item);
	}

	_onSubmitCheckBoxItem(item) {
		const { config, onSubmitStatus } = this.props;
		// onSubmitStatus(item);
		item.employee_id = config.userId;
		item.date = config.date;
		onSubmitStatus(item);
	}

	_onCancelDialogHander() {
		this.setState({open: false, selectedItem: undefined});
	}

	_onDeleteItemHander() {
		let item = this.state.selectedItem;
		this.setState({open: false, selectedItem: undefined});

		const { config, onDeleteItemHander } = this.props;
		item.employee_id = config.userId;
		item.date = config.date;
		item.isDelete = true;
		onDeleteItemHander(item);
	};


	render() {
		const {
			config
		} = this.props;
		var items = config.worklog_items;
		var timer = undefined;
		var doubleEvent = false;
		var worklogHtml = items.map((item, index) => {

			let __onClickWorkLogItem = (e) => {
				e.stopPropagation();
				doubleEvent = false;
				clearTimeout(timer);
	            timer = setTimeout(() => {
	            	if (!doubleEvent) {
	            		this._onClickWorkLogItem(item);
	            	}
	            }, 300);
				// this._onClickWorkLogItem(item);
			};

			let __onClickCheckBox = (e) => {
				e.stopPropagation();
			};

			let __onChangeCheckBox = (e) => {
				e.stopPropagation();

				item.status = e.target.checked ? 1 : 0;
				this._onSubmitCheckBoxItem(item);
			};

			let __onDblclickWorkLogItem = (e) => {
				e.stopPropagation();
				doubleEvent = true;
				this.setState({open: true, selectedItem: item});
			};
			let className = 'progress__bar ';
			// console.log(TAG);
			className += (item.tag && item.tag !== '') ? item.tag : TAG;
			item.progress = item.progress ? item.progress : 0;
			return (
				<div className="cell-top-item-inner-text" key={index}>
					<div className="worklog-layout--checkbox">
						<Checkbox
							onClick={__onClickCheckBox}
							defaultChecked = {item.status}
							onChange={__onChangeCheckBox}
						/>
					</div>
					<div className={'worklog-layout--text'} onClick={__onClickWorkLogItem} onDoubleClick={__onDblclickWorkLogItem}>
					    <div className="progress progress--active">
							  <b className={className} style={{ width: item.progress + '%' }}>
							    <span className="label-default-style c-black">
							      <em>{item.progress}%</em> {item.content}
							    </span>
							  </b>
							</div>
					</div>
				</div>
			);
		});
// <Tooltip
						// 	placement="top"
						// 	overlay={
						// 		(
						// 			<div>
						// 				<label>Progress: </label>
						// 				<span><em>{item.progress}%</em></span>
						// 				<br />
						// 				<label>Work Log: </label>
						// 				<span>{item.content}</span>
						// 			</div>
						// 		)
						// 	}
						// 	arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
						// >

					 //    	<span className="label-default-style c-white">{item.progress}% {item.content}</span>
					 //    </Tooltip>
		const actions = [
		      <FlatButton
		        label="Cancel"
		        secondary={true}
		        onTouchTap={this._onCancelDialogHander}
		      />,
		      <FlatButton
		        label="Delete"
		        primary={true}
        		keyboardFocused={true}
		        onTouchTap={this._onDeleteItemHander}
		      />,
		    ];
		return (
			<div className="cell-top-item" >
				{worklogHtml}
				<br/>
				<Dialog
		          title="Delete Work Log"
		          actions={actions}
		          modal={true}
		          open={this.state.open}
		          onRequestClose={this._onCancelDialogHander}
		        >Do you want to delete this work log item?</Dialog>
			</div>
		);
	}
}

ResourceMapCellWorkLog.propTypes = {
	config: PropTypes.object.isRequired,
	onModalHander: PropTypes.func.isRequired,
	onSubmitStatus: PropTypes.func.isRequired,
	onDeleteItemHander: PropTypes.func.isRequired
};

ResourceMapCellWorkLog.defaultProps = {
	config: {},
	onModalHander: () => {},
	onSubmitStatus: () => {}
};

export default ResourceMapCellWorkLog;