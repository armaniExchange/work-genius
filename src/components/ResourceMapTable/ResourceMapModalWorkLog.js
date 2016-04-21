import './_color.css';
import React, { Component, PropTypes } from 'react';
import moment from 'moment';

// Components
import {
	Modal
} from 'react-bootstrap';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import DatePicker from '../../components/A10-UI/Input/Date-Picker.js';
import TimePicker from 'material-ui/lib/time-picker/time-picker';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

let ModalHeader = ({isEdit}) => {
	return (
		<Modal.Header closeButton>
            <Modal.Title>{isEdit ? 'Edit Task' : 'Add Task'}</Modal.Title>
        </Modal.Header>
	);
};

let ModalFooter = ({isEdit, onSubmit, onCancelHandler}) => {
	return (
		<Modal.Footer>
            <RaisedButton label={ isEdit ? 'Update' : 'Apply' } secondary={true} onClick={onSubmit} />
            <RaisedButton label="Cancel" onClick={onCancelHandler} />
        </Modal.Footer>
	);
};

class ResourceMapModalWorkLog extends Component {
	constructor() {
		super();
		// Close modal handle
		this._onCloseModelHandler = ::this._onCloseModelHandler;
		// Submit form data
		this._onSubmitFormData = ::this._onSubmitFormData;
		// Select tag color
		this._onSelectTagColor = ::this._onSelectTagColor;
		// Submit single item
		this._onSubmitSingleItem = ::this._onSubmitSingleItem;
		// Submit multi items
		this._onSubmitMultiItems = ::this._onSubmitMultiItems;
		// Select Release Change.
		this._handleSelectReleaseChange = ::this._handleSelectReleaseChange;
		// Change start date
		this._changeStartDate = ::this._changeStartDate;
		// Change start time
		this._changeStartTime = ::this._changeStartTime;
		// Change end date
		this._changeEndDate = ::this._changeEndDate;

		this.state = {
			color: '',
			selectDate: '',
			selectTime: '',
			release: ''
		};
	}

	componentWillReceiveProps (nextProps) {
		const { defaultModalInfos } = nextProps;
		this.setState({
			release: defaultModalInfos.release,
			progress: defaultModalInfos.progress,
			color: defaultModalInfos.color
		});
	}


	_onCloseModelHandler() {
		const { onModalHander } = this.props;
		onModalHander(false, {});
	}

	/**
	 * Submit form data.
	 */
	_onSubmitFormData() {
		const { defaultModalInfos, onModalSubmit } = this.props;
		const { taskField, workLogField, progressField, durationField } = this.refs;
		let taskValue = taskField.getValue();
		let workValue = '';
		let progressValue = 0;
		if (defaultModalInfos.id !== undefined) {
			workValue = workLogField.getValue();
			progressValue = progressField.getValue();
		}
		if (taskValue !== undefined && taskValue !== '') {
			let startDate = this.state.startDate ? this.state.selectDate : defaultModalInfos.date;
			let times = moment(startDate).format('X') * 1000 + this.state.selectTime;
			let data = {
				'id': defaultModalInfos.id,
				'task': taskValue,
				'content': workValue,
				'progress': parseInt(progressValue),
				'color': this.state.color,
				'start_date': parseInt(times),
				'duration': parseInt(durationField.getValue()),
				'release': this.state.release,
				'status': defaultModalInfos.status ? defaultModalInfos.status : 0
			};
			let item = {
				id: defaultModalInfos.id,
				employee_id: defaultModalInfos.userId,
				data: data
			};
			onModalSubmit(item);
			this._onCloseModelHandler();
		}
		// this._$PrintFormData(this);
	}

	/**
	 * Use console.log() to print form data on Browser Console.
	 * This is private function.
	 */
	_$PrintFormData(self){
		const { defaultModalInfos } = self.props;
		const { taskField, workLogField, progressField, durationField } = self.refs;
		console.log('Task Value: ' + taskField.getValue());
		if (defaultModalInfos.id !== undefined){
			console.log('Work Log Value: ' + workLogField.getValue());
			console.log('Progress Value: ' + progressField.getValue());
		}

		let startDate = self.state.startDate ? self.state.selectDate : defaultModalInfos.date;
		console.log('Tag Color Value: ' + self.state.color);
		console.log('Start Date: ' + startDate);
		console.log('Start Time: ' + self.state.selectTime);
		console.log('Duration Value: ' + durationField.getValue());
		console.log('Release: ' + self.state.release);
	}

	_onSubmitSingleItem() {
		const { workLogField, progressField } = this.refs;
		const { defaultModalInfos, onModalSubmit } = this.props;

		let worklogValue = workLogField.getValue();
		let progressValue = progressField.getValue();
		if (worklogValue !== undefined && worklogValue !== '') {
			let color = this.state.color;
			let date = defaultModalInfos.date.format('YYYY-MM-DD');
			let newItem = this._createNewItem(defaultModalInfos, date, color, worklogValue, progressValue);

			onModalSubmit(newItem);
		}
	}

	_onSubmitMultiItems() {
		const { startDate, endDate, workLogField, progressField } = this.refs;
		let worklogValue = workLogField.getValue();
		let progressValue = progressField.getValue();
		if (worklogValue === undefined || worklogValue === '') {
			return;
		}
		const { defaultModalInfos, onModalSubmitMulti} = this.props;
		let startMoment = moment(startDate.value);
		let endMoment = moment(endDate.value);
		if (parseInt(startMoment.format('X')) >= parseInt(endMoment.format('X'))) {
			this._onSubmitSingleItem();
		} else {
			let dates = this._dateList(startMoment, endMoment);
			var color = this.state.color;
			let items = dates.map((date) => {
				let newItem = this._createNewItem(defaultModalInfos, date, color, worklogValue, progressValue);
				return newItem;
			});
			onModalSubmitMulti(items);
		}
	}

	_createNewItem(defaultModalInfos, date, color, worklogValue, progressValue) {
		progressValue = progressValue > 100 ? 100 : progressValue;
		let newItem = {
			color: color,
			content: worklogValue,
			progress: progressValue,
			id: defaultModalInfos.id,
			employee_id: defaultModalInfos.userId,
			date: date,
			status: defaultModalInfos.status ? defaultModalInfos.status : 0
		};
		return newItem;
	}

	_dateList(startMoment, endMoment) {
		let duration = moment.duration({'days' : 1});
		let dateList = [];
		for (let i = 0; parseInt(startMoment.format('X')) <= parseInt(endMoment.format('X')); i ++) {
			dateList.push(startMoment.format('YYYY-MM-DD'));
			startMoment.add(duration);
		}
		return dateList;
	}

	_handleSelectReleaseChange(event, index, value) {
		this.setState({release: value});
	}

	// When select a new tag color, change the state tag value.
	_onSelectTagColor(e) {
		let color = e.target.getAttribute('data-tag');
		this.setState({color: color});
	}

	_changeStartDate(date) {
		// const { startDate } = this.refs;
		// startDate.value = date;
		this.setState({selectDate: date});
	}

	_changeStartTime(e, date) {
		let time = moment(date);
		let hour = time.hour(),
		    minute = time.minute(),
		    second = time.second();
		let times = ((( hour * 60  + minute ) * 60 ) + second ) * 1000;
		this.setState({selectTime: times});
	}

	_changeEndDate(date) {
		const { endDate } = this.refs;
		endDate.value = date;
	}


	render() {
		const {
			show,
			defaultModalInfos
		} = this.props;

		defaultModalInfos.progress = defaultModalInfos.progress ? defaultModalInfos.progress : 0;
		let showDoneClassName = 'material-icons icon-layout';
		let hideDoneClassName = 'material-icons icon-layout icon-layou-display';
		let nowDate = defaultModalInfos.date;
		if (nowDate) {
			nowDate = moment(nowDate).format('YYYY-MM-DD');
		}

		let releaseOptions = ['4.1.0', '4.1.1', '3.2.1'];
		var isShowWorkLog = defaultModalInfos.id !== undefined;
		var colorHtml = (
			<div className="form-group">
				<label className="col-xs-3 control-label">Color</label>
				<div className="col-xs-9">
					<div className="event-tag">
                    	<span onClick={this._onSelectTagColor} data-tag="bgm-teal"   className="bgm-teal">
                    		<i className={this.state.color === 'bgm-teal' ? showDoneClassName : hideDoneClassName}>done</i>
                    	</span>
                        <span onClick={this._onSelectTagColor} data-tag="bgm-red"    className="bgm-red">
                    		<i className={this.state.color === 'bgm-red' ? showDoneClassName : hideDoneClassName}>done</i>
                    	</span>
                        <span onClick={this._onSelectTagColor} data-tag="bgm-pink"   className="bgm-pink">
                    		<i className={this.state.color === 'bgm-pink' ? showDoneClassName : hideDoneClassName}>done</i>
                    	</span>
                        <span onClick={this._onSelectTagColor} data-tag="bgm-blue"   className="bgm-blue">
                    		<i className={this.state.color === 'bgm-blue' ? showDoneClassName : hideDoneClassName}>done</i>
                    	</span>
                        <span onClick={this._onSelectTagColor} data-tag="bgm-lime"   className="bgm-lime">
                    		<i className={this.state.color === 'bgm-lime' ? showDoneClassName : hideDoneClassName}>done</i>
                    	</span>
                        <span onClick={this._onSelectTagColor} data-tag="bgm-green"  className="bgm-green">
                    		<i className={this.state.color === 'bgm-green' ? showDoneClassName : hideDoneClassName}>done</i>
                    	</span>
                        <span onClick={this._onSelectTagColor} data-tag="bgm-cyan"   className="bgm-cyan">
                    		<i className={this.state.color === 'bgm-cyan' ? showDoneClassName : hideDoneClassName}>done</i>
                    	</span>
                        <span onClick={this._onSelectTagColor} data-tag="bgm-orange" className="bgm-orange">
                    		<i className={this.state.color === 'bgm-orange' ? showDoneClassName : hideDoneClassName}>done</i>
                    	</span>
                        <span onClick={this._onSelectTagColor} data-tag="bgm-purple" className="bgm-purple">
                    		<i className={this.state.color === 'bgm-purple' ? showDoneClassName : hideDoneClassName}>done</i>
                    	</span>
                    </div>
				</div>
            </div>
        );
		var fullReleaseOptions = releaseOptions.map((option, index) => {
			return (<MenuItem value={option} key={index} primaryText={option} />);
		});
		var className = isShowWorkLog ? 'mdl-cell mdl-cell--6-col' : 'mdl-cell mdl-cell--12-col';
		var taskHtml = (
			<div className={className}>
			<div className="form-group">
				<label className="col-xs-3 control-label">Task</label>
				<div className="col-xs-9">
					<TextField
						type="text"
						className="text-area-style"
						defaultValue={defaultModalInfos.task}
						ref="taskField"
					/>
				</div>
			</div>
			<div className="form-group">
				<label className="col-xs-3 control-label">Start Time</label>
				<div className="col-xs-9">
					<input
				        className="hidden"
				        defaultValue={nowDate}
				        ref="startDate" />
				    <div className="col-xs-6 layout-design-padding-left-0 layout-design-over">
					<DatePicker
						className="option-layout"
						onChange={this._changeStartDate}
						defaultDate={nowDate}
						placeholder="Start Date"
					/>
					</div>
					<div className="col-xs-6 layout-design-over">
					<TimePicker
						onChange={this._changeStartTime}
					/>
					</div>
				</div>
			</div>
			<div className="form-group">
				<label className="col-xs-3 control-label">Duration</label>
				<div className="col-xs-9">
					<TextField
						type="number"
						min="0"
						max="100"
						className="text-area-duration-style"
						defaultValue={defaultModalInfos.duration}
						ref="durationField"
					/>
					<span>hours</span>
				</div>
			</div>
			<div className="form-group">
				<label className="col-xs-3 control-label">Release</label>
				<div className="col-xs-9">
					<SelectField fullWidth={true} value={this.state.release} onChange={this._handleSelectReleaseChange}>
			          {fullReleaseOptions}
			        </SelectField>
				</div>
			</div>
			{colorHtml}
			</div>
		);

		var workHtml = isShowWorkLog ? (
			<div className={className}>
				<div className="form-group">
					<label className="col-xs-3 control-label">Work Log</label>
					<div className="col-xs-9">
						<TextField
							className="text-area-style"
							multiLine={true}
							rowsMax={15}
							defaultValue={defaultModalInfos.content}
							rows={8}
							ref="workLogField"
						/>
					</div>
				</div>
				<div className="form-group">
					<label className="col-xs-3 control-label">Progress</label>
					<div className="col-xs-9">
						<TextField
							className="text-area-progress-style"
							type="number"
							min="0"
							max="100"
							defaultValue={defaultModalInfos.progress}
							ref="progressField"
						/>
						<span>%</span>
					</div>
				</div>
			</div>
			) : (<div />);

		let defaultProps = {};
		if (isShowWorkLog) {
			defaultProps.bsSize = 'large';
		}

		return (
			<Modal
				show={ show }
				onHide={ this._onCloseModelHandler }
				{...defaultProps}
			>
				<ModalHeader isEdit={defaultModalInfos.id !== undefined} />
				<Modal.Body>
				<form className="form-horizontal mdl-grid">
							{taskHtml}
		                    {workHtml}
                </form>
				</Modal.Body>
				<ModalFooter
					isEdit={defaultModalInfos.id !== undefined}
					onSubmit={this._onSubmitFormData}
					onCancelHandler={this._onCloseModelHandler}
				/>
			</Modal>
		);
	}
}

ResourceMapModalWorkLog.propTypes = {
	show               : PropTypes.bool.isRequired,
	defaultModalInfos  : PropTypes.object.isRequired,
	onModalSubmit      : PropTypes.func.isRequired,
	onModalHander      : PropTypes.func.isRequired,
	onModalSubmitMulti : PropTypes.func.isRequired
};

ResourceMapModalWorkLog.defaultProps = {
	show                   : false,
	defaultModalInfos      : {},
	onModalSubmit          : () => {},
	onCancelHandler        : () => {},
	onModalSubmitMulti     : () => {}
};

export default ResourceMapModalWorkLog;
