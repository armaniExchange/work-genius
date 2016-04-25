// Styles
import './Overtime-Apply-Modal.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import moment from 'moment';
// Components
import {
	Modal
} from 'react-bootstrap';

// Material-UI
import DatePicker from '../../components/A10-UI/Input/Date-Picker.js';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

let ModalHeader = () => {
	return (
		<Modal.Header closeButton>
            <Modal.Title>Overtime Application</Modal.Title>
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
		this._validateInput = ::this._validateInput;
		this._validateDateFormat = ::this._validateDateFormat;
	}

	_validateDateFormat(date) {
		return /^(\d{4}-\d{2}-\d{2})?$/gi.test(date);
	}

	_validateInput() {
		let startDate = this.refs.startDate.value;
		return this._validateDateFormat(startDate);
	}

	_onSubmit() {
		const { onSubmitHandler } = this.props;
		let startDate = this.refs.startDate.value,
		    memo = this.refs.memo.getValue(),
		    hours = this.refs.hours.getValue(),
		    data = {
				startDate,
				memo,
				hours
			},
			isInputValid = this._validateInput();

		data['hours'] = hours ? hours : '8';

		if (isInputValid) {
			onSubmitHandler(data);
		}
	}
	_onStartDateChange(newDate) {
		this.refs.startDate.value = newDate;
	}

	render() {
		const { show, onHideHandler } = this.props;
		let startDateClassName = classnames({
				'form-group': true
			}),
			today = moment().format('YYYY-MM-DD HH:mm');
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
						    	<DatePicker
								    defaultDate={today}
									placeholder="Start Date"
									onChange={this._onStartDateChange} />
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
