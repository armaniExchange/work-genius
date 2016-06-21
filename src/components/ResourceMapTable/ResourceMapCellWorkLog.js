import './ResourceMapTable.css';
import './progress-style.css';
import 'rc-tooltip/assets/bootstrap_white.css';
import 'rc-checkbox/assets/index.css';

import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import Tooltip from 'rc-tooltip';
import Checkbox from 'rc-checkbox';

const TAG = 'bgm-teal';

var TooltipContent = ({item}) => {
	return (
		<div className="mdl-grid" style={{ width: '300px'}}>
			<div className="mdl-cell mdl-cell--6-col"><label>Today Percentage</label></div>
			<div className="mdl-cell mdl-cell--6-col"><span>{item.daily_percentage}%</span></div>

			<div className="mdl-cell mdl-cell--6-col"><label>Task</label></div>
			<div className="mdl-cell mdl-cell--6-col"><span>{item.title}</span></div>

			<div className="mdl-cell mdl-cell--6-col"><label>Start Date</label></div>
			<div className="mdl-cell mdl-cell--6-col">
				<span><em>{moment(item.start_date).format('YYYY-MM-DD HH:MM')}</em></span>
			</div>

			<div className="mdl-cell mdl-cell--6-col"><label>End Date</label></div>
			<div className="mdl-cell mdl-cell--6-col">
				<span><em>{moment(item.end_date).format('YYYY-MM-DD HH:MM')}</em></span>
			</div>

			<div className="mdl-cell mdl-cell--6-col"><label>Duration</label></div>
			<div className="mdl-cell mdl-cell--6-col">
				<span><em>{item.duration ? item.duration : 0}</em> Hours</span>
			</div>

			<div className="mdl-cell mdl-cell--6-col"><label>Work Log</label></div>
			<div className="mdl-cell mdl-cell--6-col">
				<span>{item.content}</span>
			</div>

			<div className="mdl-cell mdl-cell--6-col"><label>Progress</label></div>
			<div className="mdl-cell mdl-cell--6-col"><em>{item.progress}%</em></div>
		</div>
	);
};

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
		let offerItem = {};
		offerItem.id = item.id;
		// offerItem.data = {status: item.status};
		item.progress = 100;
		offerItem.data = item;
		// offerItem.isStatus = true;
		offerItem.employee_id = config.userId;
		offerItem.date = config.date;
		onSubmitStatus(offerItem);
	}

	_onCancelDialogHander() {
		this.setState({open: false, selectedItem: undefined});
	}

	_onDeleteItemHander() {
		let item = this.state.selectedItem;
		this.setState({open: false, selectedItem: undefined});

		const { config, onDeleteItemHander } = this.props;
		let offerItem = {};
		item.isDelete = true;
		offerItem.id = item.id;
		// offerItem.data = {status: item.status};
		offerItem.data = item;
		offerItem.employee_id = config.userId;
		offerItem.date = config.date;
		offerItem.isDelete = true;
		onDeleteItemHander(offerItem);
	};


	render() {
		const {
			config
		} = this.props;
		var items = config.job_items;
		var timer = undefined;
		var doubleEvent = false;
		var worklogHtml = (<div/>);
		if (items instanceof Array) {
			worklogHtml = items.map((item, index) => {

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
				let classNameProgress = 'progress progress--active ';
				var defaultColor = (item.color && item.color !== '') ? item.color : TAG;
				className += defaultColor;
				classNameProgress += defaultColor + '-light';
				item.daily_percentage = item.daily_percentage ? item.daily_percentage : 0;

				return (
					<div
						className="cell-top-item-inner-text"
						key={index}
					>
						<div className="worklog-layout--checkbox">
							<Checkbox
								onClick={__onClickCheckBox}
								checked = {item.status}
								onChange={__onChangeCheckBox}
							/>
						</div>
						<div className={'worklog-layout--text'} onClick={__onClickWorkLogItem} onDoubleClick={__onDblclickWorkLogItem}>
						    <div className={classNameProgress}>
								  <b className={className} style={{ width: item.daily_percentage + '%' }}>
								  	<Tooltip
										placement="top"
										overlay={
											(<TooltipContent item={item} />)
										}
										mouseEnterDelay={1}
										arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
									>
									    <span className="label-default-style c-white">
									      <strong>{item.daily_percentage}%</strong> {item.title}
									    </span>
								    </Tooltip>
								  </b>
								</div>
						</div>
					</div>
				);
			});
		}

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