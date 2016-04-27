// Styles
import './PTO-Apply-Modal.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { convertToUtcTimeStamp } from '../../libraries/util';
// Components
import {
	Modal
} from 'react-bootstrap';
// Material-UI
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import TimePicker from 'material-ui/lib/time-picker/time-picker';

let ModalHeader = () => {
	return (
		<Modal.Header closeButton>
            <Modal.Title>PTO Application</Modal.Title>
        </Modal.Header>
	);
};

let ModalFooter = ({ onSubmit, onCancelHandler }) => {
	return (
		<Modal.Footer>
            <RaisedButton label="Apply" secondary={true} onClick={onSubmit} />
            <RaisedButton label="Cancel" onClick={onCancelHandler} />
        </Modal.Footer>
	);
};

let initialState = {
	'startDate': '',
	'endDate': '',
	'startTime': '',
	'endTime': '',
	'hours': '',
	'memo': '',
	'isStartDateEmpty': false,
	'isEndDateEmpty': false,
	'isEndLessThanStart': false,
	'isHourValid': true
};

class PTOApplyModal extends Component {
	constructor(props) {
		super(props);
		this.state = initialState;
	}

	_validateInput(data) {
		const {
			startTimeStamp,
			endTimeStamp,
			hours
		} = data;
		let newErrorState = {
				'isStartDateEmpty': false,
				'isEndDateEmpty': false,
				'isEndLessThanStart': false,
				'isHourValid': true
			},
			isInputValid = true;

		if (hours <= 0) {
			newErrorState.isHourValid = false;
			isInputValid = false;
		}
		if (!startTimeStamp) {
			newErrorState.isStartDateEmpty = true;
			isInputValid = false;
		}
		if (!endTimeStamp) {
			newErrorState.isEndDateEmpty = true;
			isInputValid = false;
		}
		if ((endTimeStamp <= startTimeStamp) && (startTimeStamp && endTimeStamp)) {
			newErrorState.isEndLessThanStart = true;
			isInputValid = false;
		}
		this.setState(newErrorState);
		return isInputValid;
	}

	_onCancel() {
		const { onCancelHandler } = this.props;
		this.setState(initialState, () => {
			onCancelHandler();
		});
	}

	_onSubmit() {
		const {
			startDate,
			endDate,
			startTime,
			endTime,
			hours,
			memo
		} = this.state;

		const { onSubmitHandler } = this.props;
		let startTimeStamp = (startDate && startTime) ? convertToUtcTimeStamp(startDate, startTime) : undefined,
		    endTimeStamp = (endDate && endTime) ? convertToUtcTimeStamp(endDate, endTime) : undefined,
			finalData = {
				startTimeStamp,
				endTimeStamp,
				hours,
				memo
			},
			isInputValidate = this._validateInput(finalData);
		if (isInputValidate) {
			this.setState(initialState, () => {
				onSubmitHandler(finalData);
			});
		}
	}

	render() {
		const { show, onHideHandler } = this.props;
		const {
			startDate,
			endDate,
			hours,
			memo,
			isStartDateEmpty,
			isEndDateEmpty,
			isEndLessThanStart,
			isHourValid
		} = this.state;
		let startDateClassName = classnames({
				'form-group': true
			}),
			endDateClassName = classnames({
				'form-group': true
			});

		return (
			<Modal ref="modal" show={show} onHide={onHideHandler}>
				<ModalHeader {...this.props} />
				<Modal.Body>
					<form className="form-horizontal">
					    <div className={startDateClassName}>
						    <label className="col-xs-3 control-label">
							    Start Date
							</label>
						    <div className="col-xs-9">
						    	<DatePicker
								    value={startDate}
									placeholder="Start Date"
									onChange={(err, newDate) => {
										this.setState({
											startDate: newDate
										});
									}} />
						    </div>
						</div>
					    <div className={startDateClassName}>
						    <label className="col-xs-3 control-label">
							    Start Time
							</label>
						    <div className="col-xs-9">
						    	<TimePicker
									placeholder="Start Time"
									onChange={(err, newTime) => {
										this.setState({
											startTime: newTime
										});
									}} />
						    </div>
						</div>
						<div className={isStartDateEmpty ? 'col-xs-12 error' : 'col-xs-12 hide'}>
							Start date and time must not be empty!
						</div>
					    <div className={endDateClassName}>
						    <label className="col-xs-3 control-label">
							    End Date
							</label>
						    <div className="col-xs-9">
						        <DatePicker
								    value={endDate}
									placeholder="End Date"
									onChange={(err, newDate) => {
										this.setState({
											endDate: newDate
										});
									}} />
						    </div>
						</div>
						<div className={endDateClassName}>
						    <label className="col-xs-3 control-label">
							    End Time
							</label>
						    <div className="col-xs-9">
						    	<TimePicker
									placeholder="End Time"
									onChange={(err, newTime) => {
										this.setState({
										    endTime: newTime
										});
									}} />
						    </div>
						</div>
						<div className={isEndDateEmpty ? 'col-xs-12 error' : 'col-xs-12 hide'}>
						    End date and time must not be empty!
						</div>
						<div className={isEndLessThanStart ? 'col-xs-12 error' : 'col-xs-12 hide'}>
							End date must not be earlier than Start date
						</div>
						<label className="col-xs-3 control-label">
						    Total Hours
						</label>
				    	<div className="col-xs-9">
				    		<TextField
							    value={hours}
							    hintText="hour(s)"
								type="number"
								errorText={isHourValid ? '' : 'Hours must not be empty or less than 1'}
								onChange={(e) => {
									this.setState({
										hours: e.target.value
									});
								}} />
				    	</div>
						<div>
							<label className="col-xs-3 control-label">
							    Memo
							</label>
					    	<div className="col-xs-9">
					    		<TextField
								    hintText="Memo"
									value={memo}
									multiLine={true}
									rows={2}
									rowsMax={4}
									onChange={(e) => {
										this.setState({
											memo: e.target.value
										});
									}} />
					    	</div>
						</div>
						<div style={{clear:'both'}}></div>
					</form>
		        </Modal.Body>
		        <ModalFooter
		        	onSubmit={::this._onSubmit}
					onCancelHandler={::this._onCancel}  />
			</Modal>
		);
	}
};

PTOApplyModal.propTypes = {
	show            : PropTypes.bool,
	onHideHandler   : PropTypes.func,
	onSubmitHandler : PropTypes.func,
	onCancelHandler : PropTypes.func
};

PTOApplyModal.defaultProps = {
	show            : false,
	onHideHandler   : () => {},
	onSubmitHandler : () => {},
	onCancelHandler : () => {}
};

export default PTOApplyModal;
