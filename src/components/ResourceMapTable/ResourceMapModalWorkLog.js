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
import Tooltip from 'rc-tooltip';

import Select from 'react-select';

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

let initialState = {
	color: '',
	selectDate: '',
	selectTime: '',
	release: '',
	tags: '',
	title: '',
	endDate: '',
	endTime: '',
	//the properties for valiation
	isTitleEmpty: false,
	isDurationEmpty: false,
	isEndLessThanStart: false
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
		// Select Tag
		this._onSelectTag = ::this._onSelectTag;
		// Change start date
		this._changeStartDate = ::this._changeStartDate;
		// Change start time
		this._changeStartTime = ::this._changeStartTime;
		// Change end date
		this._changeEndDate = ::this._changeEndDate;
		// Change end time
		this._changeEndTime = ::this._changeEndTime;
        // Change task title
		this._handleSelectTitleChange = ::this._handleSelectTitleChange;

		this.state = initialState;
	}

	componentWillReceiveProps (nextProps) {
		const { show, defaultModalInfos } = nextProps;
		defaultModalInfos.tags = defaultModalInfos.tags ? defaultModalInfos.tags : [];
		if (show) {
			let tag = this.state.tags !== '' ? this.state.tags : defaultModalInfos.tags.join(',');
			let release = this.state.release !== '' ? this.state.release : defaultModalInfos.release;
			let title = this.state.title !== '' ? this.state.title : defaultModalInfos.title;
			this.setState({
				release: release,
				progress: defaultModalInfos.progress,
				color: defaultModalInfos.color,
				tags: tag,
				title: title
			});
		} else {
			this.setState({
				release: '',
				progress: 0,
				color: '',
				tags: '',
				title: '',
				isTitleEmpty: false,
				isDurationEmpty: false,
				isEndLessThanStart: false,
				endDate: '',
				endTime: ''
			});
		}
	}

	//validate the input
	//when create/edit task, title,duration,start date and end date can't be empty.
	_validateInput(data) {
		const {
			start_date,
			end_date,
			title,
			duration
		} = data;
		let newErrorState = {
				isTitleEmpty: false,
				isDurationEmpty: false,
				isEndLessThanStart: false
			},
			isInputValid = true;

		if (!title) {
			newErrorState.isTitleEmpty = true;
			isInputValid = false;
		}
		if (end_date <= start_date) {
			newErrorState.isEndLessThanStart = true;
			isInputValid = false;
		}
		if (!duration) {
			newErrorState.isDurationEmpty = true;
			isInputValid = false;
		}
		this.setState(newErrorState);
		return isInputValid;
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
		const { workLogField, progressField, durationField } = this.refs;
		let workValue = '';
		let progressValue = 0;
		let taskValue = this.state.title;
		if (defaultModalInfos.id !== undefined) {
			workValue = workLogField.getValue();
			progressValue = progressField.getValue();
			progressValue = parseInt(progressValue) > 100 ? 100 : parseInt(progressValue);
			progressValue = parseInt(progressValue) < 0 ? 0 : parseInt(progressValue);
		}
		let startDate, endDate;
		if (defaultModalInfos.id !== undefined) {
			startDate = this.state.selectDate ? this.state.selectDate : defaultModalInfos.start_date;
			endDate = this.state.endDate ? this.state.endDate : defaultModalInfos.end_date;
		} else {
			startDate = this.state.selectDate ? this.state.selectDate : defaultModalInfos.date;
			endDate = this.state.endDate ? this.state.endDate : defaultModalInfos.date;
		}
		let times;
		if (this.state.selectTime) {
			times = Number.parseFloat(moment(moment(startDate).format('YYYY-MM-DD')).format('x')) + this.state.selectTime;
		} else {
			if (defaultModalInfos.id !== undefined){
				times = Number.parseFloat(moment(startDate).format('x'));
			} else {
				times = Number.parseFloat(moment(startDate).hour(9).format('x'));
			}
		}
		let endTimeStamp;
		if (this.state.endTime){
			endTimeStamp = Number.parseFloat(moment(moment(endDate).format('YYYY-MM-DD')).format('x')) + this.state.endTime;
		} else {
			if (defaultModalInfos.id !== undefined){
				let hour = moment(defaultModalInfos.end_date).hour(),
					min = moment(defaultModalInfos.end_date).minute();
				endTimeStamp = Number.parseFloat(moment(endDate).hour(hour).minute(min).format('x'));
			} else {
				endTimeStamp = Number.parseFloat(moment(endDate).hour(18).format('x'));
			}
		}
		let status = defaultModalInfos.status ? defaultModalInfos.status : 0;
		// If progress is 100%, the status is 1;
		status = parseInt(progressValue) >= 100 ? 1 : 0;
		let color = (this.state.color === undefined || this.state.color === '')
			? this._$defaultColor() : this.state.color;
		let data = {
			'employee_id': defaultModalInfos.userId,
			'id': defaultModalInfos.id,
			'title': taskValue,
			'content': workValue,
			'progress': parseInt(progressValue),
			'color': color,
			'start_date': parseInt(times),
			'duration': parseInt(durationField.getValue()),
			'release': this.state.release,
			'status': status,
			'tags': this.state.tags.split(','),
			'end_date': endTimeStamp
		};
		let item = {
			id: defaultModalInfos.id,
			employee_id: defaultModalInfos.userId,
			data: data
		};
		let isValidInput = this._validateInput(data);
		if (isValidInput){
			onModalSubmit(item);
			this._onCloseModelHandler();
		}
		
		// this._$PrintFormData(this);
	}

	_$defaultColor() {
		let list = [ 'bgm-teal', 'bgm-red', 'bgm-pink', 'bgm-blue', 'bgm-lime',
					 'bgm-green', 'bgm-cyan', 'bgm-orange', 'bgm-purple'];

		var Rand = Math.random();
		let num = Math.round(Rand * 9);
		return list[num];
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

		let startDate = self.state.selectDate ? self.state.selectDate : defaultModalInfos.date;
		console.log(self.state.startDate);
		console.log(self.state.selectDate);
		console.log(self.state.selectTime);
		startDate instanceof moment ? console.log(startDate.format('YYYY-MM-DD')) : console.log(startDate);
		console.log('Tag Color Value: ' + self.state.color);
		console.log('Start Date: ' + startDate);
		console.log('Start Time: ' + self.state.selectTime);
		console.log('Duration Value: ' + durationField.getValue());
		console.log('Release: ' + self.state.release);
		console.log('Tags: ' + self.state.tags);
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

	_handleSelectReleaseChange(value) {
		const { releases, onAddReleaseHandler } = this.props;
		this.setState({release: value});

		let release = releases.find((option) => {
			return option.tag_name === value;
		});

		if (!release) {
			onAddReleaseHandler(value);
		}
	}

	// When select a new tag color, change the state tag value.
	_onSelectTagColor(e) {
		let color = e.target.getAttribute('data-tag');
		this.setState({color: color});
	}

	_onSelectTag(type) {
		this.setState({tags: type});
		let types = type.split(',');
		const { tags, onAddTagHandler } = this.props;
		for (let newType of types) {
			let tag = tags.find((inTag) => {
				return inTag.tag_name === newType;
			});
			if (newType !== undefined && tag === undefined) {
				onAddTagHandler(newType);
			}
		}
 	}

	_changeStartDate(date) {
		// const { startDate } = this.refs;
		// startDate.value = date;
		this.setState({selectDate: date});
	}

	_handleSelectTitleChange(title) {
		this.setState({title: title});
	}

	_handleSelectTitleBlur() {
		const { titleRef } = this.refs;
		let title = titleRef._optionsFilterString === ''
			? titleRef.state.value : titleRef._optionsFilterString;
		this.setState({ title: title });
	}

	_changeStartTime(e, date) {
		let time = moment(date);
		let hour = time.hour(),
		    minute = time.minute(),
		    second = time.second();
		let times = ((( hour * 60  + minute ) * 60 ) + second ) * 1000;
		this.setState({selectTime: times});
	}

	_changeEndTime(e, date) {
		console.log('end time');
		console.log(date);
		let time = moment(date);
		let hour = time.hour(),
		    minute = time.minute(),
		    second = time.second();
		let times = ((( hour * 60  + minute ) * 60 ) + second ) * 1000;
		this.setState({endTime: times});
	}

	_changeEndDate(date) {
		const { endDate } = this.refs;
		endDate.value = date;
	}

	render() {
		const {
			show,
			tags,
			titles,
			releases,
			defaultModalInfos
		} = this.props;
		const {
			isTitleEmpty,
			isDurationEmpty,
			isEndLessThanStart
		} = this.state;
		defaultModalInfos.progress = defaultModalInfos.progress ? defaultModalInfos.progress : 0;
		let showDoneClassName = 'material-icons icon-layout';
		let hideDoneClassName = 'material-icons icon-layout icon-layou-display';
		let nowDate,defaultEndDate;
		if (defaultModalInfos.id) {
			nowDate = moment(defaultModalInfos.start_date).format('YYYY-MM-DD hh:mm a');
			defaultEndDate = moment(defaultModalInfos.end_date).format('YYYY-MM-DD hh:mm a');
		} else {
			nowDate = moment(defaultModalInfos.date).hour(9).format('YYYY-MM-DD hh:mm a');
			defaultEndDate = moment(defaultModalInfos.date).hour(18).format('YYYY-MM-DD hh:mm a');
		}
		// let releaseOptions = ['4.1.0', '4.1.1', '3.2.1'];
		var isShowWorkLog = defaultModalInfos.id !== undefined;
		var colorHtml = (
			<div className="form-group">
				<label className="col-xs-3 control-label">Color</label>
				<div className="col-xs-9">
					<div className="event-tag">
						<Tooltip placement="top" overlay={'Level 1: Doing Now'}
							arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
						>
	                        <span onClick={this._onSelectTagColor} data-tag="bgm-red"    className="bgm-red">
	                    		<i className={this.state.color === 'bgm-red' ? showDoneClassName : hideDoneClassName}>done</i>
	                    	</span>
                    	</Tooltip>
                    	{/*<Tooltip placement="top" overlay={'Level 2'}
							arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
						>
	                        <span onClick={this._onSelectTagColor} data-tag="bgm-pink"   className="bgm-pink">
	                    		<i className={this.state.color === 'bgm-pink' ? showDoneClassName : hideDoneClassName}>done</i>
	                    	</span>
                    	</Tooltip>
                    	<Tooltip placement="top" overlay={'Level 3'}
							arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
						>
	                        <span onClick={this._onSelectTagColor} data-tag="bgm-purple" className="bgm-purple">
	                    		<i className={this.state.color === 'bgm-purple' ? showDoneClassName : hideDoneClassName}>done</i>
	                    	</span>
                    	</Tooltip>
                    	<Tooltip placement="top" overlay={'Level 4'}
							arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
						>
	                        <span onClick={this._onSelectTagColor} data-tag="bgm-orange" className="bgm-orange">
	                    		<i className={this.state.color === 'bgm-orange' ? showDoneClassName : hideDoneClassName}>done</i>
	                    	</span>
                    	</Tooltip>*/}
                    	<Tooltip placement="top" overlay={'Level 2'}
							arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
						>
	                        <span onClick={this._onSelectTagColor} data-tag="bgm-lime"   className="bgm-lime">
	                    		<i className={this.state.color === 'bgm-lime' ? showDoneClassName : hideDoneClassName}>done</i>
	                    	</span>
                    	</Tooltip>
                    	{/*}<Tooltip placement="top" overlay={'Level 6'}
							arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
						>
	                        <span onClick={this._onSelectTagColor} data-tag="bgm-blue"   className="bgm-blue">
	                    		<i className={this.state.color === 'bgm-blue' ? showDoneClassName : hideDoneClassName}>done</i>
	                    	</span>
                    	</Tooltip>
                    	<Tooltip placement="top" overlay={'Level 7'}
							arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
						>
	                        <span onClick={this._onSelectTagColor} data-tag="bgm-cyan"   className="bgm-cyan">
	                    		<i className={this.state.color === 'bgm-cyan' ? showDoneClassName : hideDoneClassName}>done</i>
	                    	</span>
                    	</Tooltip>
                    	<Tooltip placement="top" overlay={'Level 8'}
							arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
						>
	                        <span onClick={this._onSelectTagColor} data-tag="bgm-green"  className="bgm-green">
	                    		<i className={this.state.color === 'bgm-green' ? showDoneClassName : hideDoneClassName}>done</i>
	                    	</span>
                    	</Tooltip>*/}
                    	<Tooltip placement="top" overlay={'Level 3: Doing once free'}
							arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
						>
	                    	<span onClick={this._onSelectTagColor} data-tag="bgm-teal"   className="bgm-teal">
	                    		<i className={this.state.color === 'bgm-teal' ? showDoneClassName : hideDoneClassName}>done</i>
	                    	</span>
                    	</Tooltip>
                    </div>
				</div>
            </div>
        );
		var className = isShowWorkLog ? 'mdl-cell mdl-cell--6-col' : 'mdl-cell mdl-cell--12-col';
		var taskHtml = (
			<div className={className}>
			<div className="form-group">
				<label className="col-xs-3 control-label">Task</label>
				<div className="col-xs-9">
					<Select
						allowCreate={true}
						name="menu_tag"
						value={this.state.title}
						options={titles.map((option) => {
							return {label: option, value: option};
						})}
						ref="titleRef"
						onChange={this._handleSelectTitleChange}
						onBlur={::this._handleSelectTitleBlur}
					/>
				</div>
			</div>
			<div className={isTitleEmpty ? 'col-xs-3 error' : 'col-xs-3 hide'}>
			</div>
			<div className={isTitleEmpty ? 'col-xs-9 error left-align' : 'col-xs-9 hide'}>
			    Task  must not be empty!
			</div>
			<div className="form-group">
				<label className="col-xs-3 control-label">Release</label>
				<div className="col-xs-9">
			        <Select
						allowCreate={true}
		                name="menu_tag"
		                value={this.state.release}
		                options={releases.map((option) => {
		                	return {label: option.tag_name, value: option.tag_name};
		                })}
		                onChange={this._handleSelectReleaseChange}
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
						defaultTime={new Date(nowDate)}
						onChange={this._changeStartTime}
					/>
					</div>
				</div>
			</div>
			<div className="form-group">
				<label className="col-xs-3 control-label">End Time</label>
				<div className="col-xs-9">
					<input
				        className="hidden"
				        defaultValue={defaultEndDate}
				        ref="endDate" />
				    <div className="col-xs-6 layout-design-padding-left-0 layout-design-over">
					<DatePicker
						className="option-layout"
						onChange={(newDate) => {
							this.setState({
								endDate: newDate
							});
						}}
						defaultDate={defaultEndDate}
						placeholder="End Date"
					/>
					</div>
					<div className="col-xs-6 layout-design-over">
					<TimePicker
						defaultTime={new Date(defaultEndDate)}
						onChange={this._changeEndTime}
					/>
					</div>
				</div>
			</div>
			<div className={isEndLessThanStart ? 'col-xs-3 error' : 'col-xs-3 hide'}>
			</div>
			<div className={isEndLessThanStart ? 'col-xs-9 error left-align' : 'col-xs-9 hide'}>
		    	End time must not be earlier than Start time!
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
			<div className={isDurationEmpty ? 'col-xs-3 error' : 'col-xs-3 hide'}>
			</div>
			<div className={isDurationEmpty ? 'col-xs-9 error left-align' : 'col-xs-9 hide'}>
			    Duration must not be empty!
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
							rows={7}
							ref="workLogField"
						/>
					</div>
				</div>
				<div className="form-group">
					<label className="col-xs-3 control-label">Tag</label>
					<div className="col-xs-9">
						<Select
							multi={true}
							allowCreate={true}
			                name="menu_tag"
			                value={this.state.tags}
			                options={tags.map((tag) => {
			                	return {label: tag.tag_name, value: tag.tag_name};
			                })}
			                onChange={this._onSelectTag}
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
	tags               : PropTypes.array.isRequired,
	titles             : PropTypes.array.isRequired,
	releases           : PropTypes.array.isRequired,
	defaultModalInfos  : PropTypes.object.isRequired,
	onModalSubmit      : PropTypes.func.isRequired,
	onModalHander      : PropTypes.func.isRequired,
	onModalSubmitMulti : PropTypes.func.isRequired,
	onAddTagHandler    : PropTypes.func.isRequired,
	onAddReleaseHandler: PropTypes.func.isRequired
};

ResourceMapModalWorkLog.defaultProps = {
	show                   : false,
	defaultModalInfos      : {},
	onModalSubmit          : () => {},
	onCancelHandler        : () => {},
	onModalSubmitMulti     : () => {}
};

export default ResourceMapModalWorkLog;
