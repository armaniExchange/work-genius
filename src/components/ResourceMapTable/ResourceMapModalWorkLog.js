import React, { Component, PropTypes } from 'react';
import moment from 'moment';

// Components
import {
	Modal
} from 'react-bootstrap';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import DatePicker from '../../components/A10-UI/Input/Date-Picker.js';

let ModalHeader = () => {
	return (
		<Modal.Header closeButton>
            <Modal.Title>Append A Work Log</Modal.Title>
        </Modal.Header>
	);
};

let ModalFooter = ({onSubmit, onCancelHandler}) => {
	return (
		<Modal.Footer>
            <RaisedButton label="Apply" secondary={true} onClick={onSubmit} />
            <RaisedButton label="Cancel" onClick={onCancelHandler} />
        </Modal.Footer>
	);
};

class ResourceMapModalWorkLog extends Component {
	constructor() {
		super();
		// this.setState({});
		this._onCloseModelHandler = ::this._onCloseModelHandler;
		this._onSubmitFormData = ::this._onSubmitFormData;
		this._onSelectTagColor = ::this._onSelectTagColor;
		this._onSubmitSingleItem = ::this._onSubmitSingleItem;
		this._onSubmitMultiItems = ::this._onSubmitMultiItems;
		this._changeStartDate = ::this._changeStartDate;
		this._changeEndDate = ::this._changeEndDate;
		this.state = {tag: ''};
	}

	_onCloseModelHandler() {
		const { onModalHander } = this.props;
		onModalHander(false, {});
	}

	_onSubmitFormData() {
		const { defaultModalInfos } = this.props;
		if (defaultModalInfos.id) {
			this._onSubmitSingleItem();
		} else {
			this._onSubmitMultiItems();
		}
		this._onCloseModelHandler();
	}

	_onSubmitSingleItem() {
		const { workLogField, progressField } = this.refs;
		const { defaultModalInfos, onModalSubmit } = this.props;

		let worklogValue = workLogField.getValue();
		let progressValue = progressField.getValue();
		if (worklogValue !== undefined && worklogValue !== '') {
			let tag = this.state.tag;
			let date = defaultModalInfos.date.format('YYYY-MM-DD');
			let newItem = this._createNewItem(defaultModalInfos, date, tag, worklogValue, progressValue);

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
			var tag = this.state.tag;
			let items = dates.map((date) => {
				let newItem = this._createNewItem(defaultModalInfos, date, tag, worklogValue, progressValue);
				return newItem;
			});
			onModalSubmitMulti(items);
		}
	}

	_createNewItem(defaultModalInfos, date, tag, worklogValue, progressValue) {
		progressValue = progressValue > 100 ? 100 : progressValue;
		let newItem = {
			tag: tag,
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

	_onSelectTagColor(e) {
		let tag = e.target.getAttribute('data-tag');
		this.setState({tag: tag});
	}

	_changeStartDate(date) {
		const { startDate } = this.refs;
		startDate.value = date;
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
		let startEndDate = '';
		if (defaultModalInfos.id === undefined) {
			let nowDate = defaultModalInfos.date;
			if (nowDate) {
				nowDate = nowDate.format('YYYY-MM-DD');
			}
			startEndDate = (
				<div>
				<div className="form-group">
					<label className="col-xs-3 control-label">Start Date</label>
					<div className="col-xs-9">
						<input
					        className="hidden"
					        defaultValue={nowDate}
					        ref="startDate" />
						<DatePicker className="option-layout" onChange={this._changeStartDate} defaultDate={nowDate} placeholder="Start Date" />
					</div>
				</div>
				<div className="form-group">
					<label className="col-xs-3 control-label">End Date</label>
					<div className="col-xs-9">
						<input
					        className="hidden"
					        defaultValue={nowDate}
					        ref="endDate" />
						<DatePicker className="option-layout" onChange={this._changeEndDate} defaultDate={nowDate} placeholder="End Date" />
					</div>
				</div>
				</div>
			);
		}

		return (
			<Modal show={show} onHide={this._onCloseModelHandler}>
				<ModalHeader />
				<Modal.Body>
				<form className="form-horizontal">
					<div className="form-group">
						<label className="col-xs-3 control-label">Work Log</label>
						<div className="col-xs-9">
							<TextField
								className="text-area-style"
								multiLine={true}
								rowsMax={6}
								defaultValue={defaultModalInfos.content}
								rows={3}
								ref="workLogField"
							/>
						</div>
					</div>
					{startEndDate}
					<div className="form-group">
						<label className="col-xs-3 control-label">Progress</label>
						<div className="col-xs-9">
							<TextField
								type="number"
								min="0"
								max="100"
								className="text-area-style"
								defaultValue={defaultModalInfos.progress}
								ref="progressField"
							/>
						</div>
					</div>
					<div className="form-group">
						<label className="col-xs-3 control-label">Tag Color</label>
						<div className="col-xs-9">
							<div className="event-tag">
	                        	<span onClick={this._onSelectTagColor} data-tag="bgm-teal"   className="bgm-teal">
	                        		<i className={this.state.tag === 'bgm-teal' ? showDoneClassName : hideDoneClassName}>done</i>
	                        	</span>
	                            <span onClick={this._onSelectTagColor} data-tag="bgm-red"    className="bgm-red">
	                        		<i className={this.state.tag === 'bgm-red' ? showDoneClassName : hideDoneClassName}>done</i>
	                        	</span>
	                            <span onClick={this._onSelectTagColor} data-tag="bgm-pink"   className="bgm-pink">
	                        		<i className={this.state.tag === 'bgm-pink' ? showDoneClassName : hideDoneClassName}>done</i>
	                        	</span>
	                            <span onClick={this._onSelectTagColor} data-tag="bgm-blue"   className="bgm-blue">
	                        		<i className={this.state.tag === 'bgm-blue' ? showDoneClassName : hideDoneClassName}>done</i>
	                        	</span>
	                            <span onClick={this._onSelectTagColor} data-tag="bgm-lime"   className="bgm-lime">
	                        		<i className={this.state.tag === 'bgm-lime' ? showDoneClassName : hideDoneClassName}>done</i>
	                        	</span>
	                            <span onClick={this._onSelectTagColor} data-tag="bgm-green"  className="bgm-green">
	                        		<i className={this.state.tag === 'bgm-green' ? showDoneClassName : hideDoneClassName}>done</i>
	                        	</span>
	                            <span onClick={this._onSelectTagColor} data-tag="bgm-cyan"   className="bgm-cyan">
	                        		<i className={this.state.tag === 'bgm-cyan' ? showDoneClassName : hideDoneClassName}>done</i>
	                        	</span>
	                            <span onClick={this._onSelectTagColor} data-tag="bgm-orange" className="bgm-orange">
	                        		<i className={this.state.tag === 'bgm-orange' ? showDoneClassName : hideDoneClassName}>done</i>
	                        	</span>
	                            <span onClick={this._onSelectTagColor} data-tag="bgm-purple" className="bgm-purple">
	                        		<i className={this.state.tag === 'bgm-purple' ? showDoneClassName : hideDoneClassName}>done</i>
	                        	</span>
	                            <span onClick={this._onSelectTagColor} data-tag="bgm-black"  className="bgm-black">
	                        		<i className={this.state.tag === 'bgm-black' ? showDoneClassName : hideDoneClassName}>done</i>
	                        	</span>
	                        </div>
						</div>
                    </div>
                </form>
				</Modal.Body>
				<ModalFooter onSubmit={this._onSubmitFormData} onCancelHandler={this._onCloseModelHandler}/>
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
