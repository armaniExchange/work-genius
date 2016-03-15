// Styles
import './PTO-Apply-Modal.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import moment from 'moment';
// Components
import {
	Modal
} from 'react-bootstrap';

// Material-UI
import injectTapEventPlugin from 'react-tap-event-plugin';injectTapEventPlugin();//<---move to application-level
import DatePicker from '../../components/A10-UI/Input/Date-Picker.js';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

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

class PTOApplyModal extends Component {
	constructor(props) {
		super(props);
		this._onSubmit = ::this._onSubmit;
		this._onStartDateChange = ::this._onStartDateChange;
		this._onEndDateChange = ::this._onEndDateChange;
		this._validateInput = ::this._validateInput;
		this._validateDateFormat = ::this._validateDateFormat;
	}

	_validateDateFormat(date) {
		return /^(\d{4}-\d{2}-\d{2})?$/gi.test(date);
	}

	_validateInput() {
		let startDate = this.refs.startDate.value,
		    endDate = this.refs.endDate.value,
		    isStartDateValid = this._validateDateFormat(startDate),
		    isEndDateValid = this._validateDateFormat(endDate);
		return isStartDateValid && isEndDateValid;
	}

	_onSubmit() {
		const { onSubmitHandler } = this.props;
		let startDate = this.refs.startDate.value,
		    endDate = this.refs.endDate.value,
		    memo = this.refs.memo.getValue(),
		    hours = this.refs.hours.getValue(),
		    data = {
				startDate,
				endDate,
				memo,
				hours
			},
			dayDifferences = moment(endDate).diff(moment(startDate), 'days'),
			isInputValid = this._validateInput();

		data['hours'] = hours ? hours : ((dayDifferences + 1) * 8).toString(10);

		if (isInputValid) {
			onSubmitHandler(data);
		}
	}
	_onStartDateChange(newDate) {
		this.refs.startDate.value = newDate;
	}
	_onEndDateChange(newDate) {
		this.refs.endDate.value = newDate;
	}

	render() {
		const { show, onHideHandler } = this.props;
		let startDateClassName = classnames({
				'form-group': true
			}),
			endDateClassName = classnames({
				'form-group': true
			}),
			today = moment().format('YYYY-MM-DD');
		return (
			<Modal ref="modal" show={show} onHide={onHideHandler}>
				<ModalHeader {...this.props} />
				<Modal.Body>
					<form className="form-horizontal">
					    <input
					        className="hidden"
					        defaultValue={today}
					        onChange={this._validateInput}
					        ref="startDate" />
					    <div className={startDateClassName}>
						    <label className="col-xs-3 control-label">Start Date</label>
						    <div className="col-xs-9">
						    	<DatePicker defaultDate={today} placeholder="Start Date" onChange={(val)=>{
						    		this._onStartDateChange(val);
						    	}} />
						    </div>
						</div>
						<input
					        className="hidden"
					        defaultValue={today}
					        onChange={this._validateInput}
					        ref="endDate" />
					    <div className={endDateClassName}>
						    <label className="col-xs-3 control-label">End Date</label>
						    <div className="col-xs-9">
						        <DatePicker defaultDate={today} placeholder="End Date" onChange={(val)=>{
						    		this._onEndDateChange(val);
						    	}} />
						    </div>
						</div>
						<div>
							<label className="col-xs-3 control-label">Total Hours</label>
					    	<div className="col-xs-9">
					    		<TextField hintText="hour(s)" ref="hours" type="number" />
					    	</div>
						</div>
						<div>
							<label className="col-xs-3 control-label">Memo</label>
					    	<div className="col-xs-9">
					    		<TextField hintText="Memo" ref="memo" multiLine={true} rows={2} rowsMax={4} />
					    	</div>
						</div>
						<div style={{clear:'both'}}></div>
					</form>
		        </Modal.Body>
		        <ModalFooter
		        	onSubmit={this._onSubmit}
		            {...this.props} />
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
