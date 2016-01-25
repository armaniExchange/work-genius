// Styles
import './PTO-Apply-Modal.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import moment from 'moment';
// Components
import {
	Button,
	Modal,
	Input
} from 'react-bootstrap';
import DateTimeField from 'react-bootstrap-datetimepicker';

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
            <Button onClick={onSubmit}>Apply</Button>
            <Button onClick={onCancelHandler}>Cancel</Button>
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
		this.state = {
			isStartDateInvalid: false,
			isEndDateInvalid: false
		};
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
		if (this._validateDateFormat(newDate)) {
			this.setState({
				isStartDateInvalid: false
			});
		} else {
			this.setState({
				isStartDateInvalid: true
			});
		}
	}
	_onEndDateChange(newDate) {
		this.refs.endDate.value = newDate;
		if (this._validateDateFormat(newDate)) {
			this.setState({
				isEndDateInvalid: false
			});
		} else {
			this.setState({
				isEndDateInvalid: true
			});
		}
	}

	render() {
		const { show, onHideHandler } = this.props;
		let startDateClassName = classnames({
				'form-group': true,
				'has-error': this.state.isStartDateInvalid
			}),
			endDateClassName = classnames({
				'form-group': true,
				'has-error': this.state.isEndDateInvalid
			}),
			today = moment().format('YYYY-MM-DD');
		return (
			<Modal show={show} onHide={onHideHandler}>
				<ModalHeader {...this.props} />
				<Modal.Body>
					<form className="form-horizontal">
					    <input
					        className="hidden"
					        defaultValue={today}
					        onChange={this._validateInput}
					        ref="startDate" />
					    <div className={startDateClassName}>
						    <label className="col-xs-2 control-label">Start Date</label>
						    <div className="col-xs-10">
						        <DateTimeField
						            dateTime={today}
						            format="YYYY-MM-DD"
						            inputFormat="YYYY-MM-DD"
						            mode="date"
						            showToday
						            onChange={this._onStartDateChange} />
						    </div>
						</div>
						<input
					        className="hidden"
					        defaultValue={today}
					        onChange={this._validateInput}
					        ref="endDate" />
					    <div className={endDateClassName}>
						    <label className="col-xs-2 control-label">End Date</label>
						    <div className="col-xs-10">
						        <DateTimeField
						            dateTime={today}
						            format="YYYY-MM-DD"
						            inputFormat="YYYY-MM-DD"
						            mode="date"
						            showToday
						            onChange={this._onEndDateChange} />
						    </div>
						</div>
						<Input
						    type="number"
					        label="Total Hours"
					        labelClassName="col-xs-2"
					        wrapperClassName="col-xs-10"
					        ref="hours" />
						<Input
						    type="textarea"
					        label="Memo"
					        labelClassName="col-xs-2"
					        wrapperClassName="col-xs-10"
					        placeholder="Enter memo here"
					        ref="memo" />
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
