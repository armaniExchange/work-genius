// Styles
import './_Inline-Table-Input-DatePicker.scss';
import 'react-datepicker/dist/react-datepicker.css';

// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import moment from 'moment';

// Component
import DatePicker from 'react-datepicker';

class InlineTableInputDatePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showInput: false,
			date: moment(new Date(props.defaultData)).isValid() ? moment(props.defaultData) : moment()
		};
		this._onEditHandler = ::this._onEditHandler;
		this._onCancelHandler = ::this._onCancelHandler;
		this._onSubmitHandler = ::this._onSubmitHandler;
		this._onDateChangeHandler = ::this._onDateChangeHandler;
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			date: moment(new Date(nextProps.defaultData)).isValid() ? moment(nextProps.defaultData) : moment()
		});
	}

	_onEditHandler() {
		this.setState({
			showInput: true
		});
	}

	_onCancelHandler() {
		this.setState({
			showInput: false
		});
	}

	_onDateChangeHandler(date) {
		this.setState({
			date: date
		});
	}

	_onSubmitHandler() {
		const { onSubmitHandler } = this.props;
		const { date } = this.state;
		let newEta = date ? date.format('YYYY-MM-DD') : '';
		onSubmitHandler(newEta);
		this.setState({
			showInput: false,
			date: newEta ? date : moment()
		});
	}

	render() {
		const { defaultData } = this.props;
		let { showInput, date } = this.state;
		let dataClass = classnames('inline-table-input-datepicker__data', {
			'inline-table-input-datepicker__data--hide': showInput
		});
		let inputClass = classnames('inline-table-input-datepicker__input', {
			'inline-table-input-datepicker__input--hide': !showInput
		});
		return (
			<td className="inline-table-input-datepicker">
				<span className={dataClass}>
				    <span>{defaultData}</span>
				    <button
				        className="mdl-button mdl-js-button mdl-button--icon"
				        onClick={this._onEditHandler}>
					    <i className="material-icons">create</i>
					</button>
				</span>
				<span className={inputClass}>
				    <DatePicker
				        selected={date}
				        minDate={moment()}
				        onChange={this._onDateChangeHandler} />
			    	<button
				        className="mdl-button mdl-js-button mdl-button--icon"
				        onClick={this._onSubmitHandler}>
					    <i className="material-icons">send</i>
					</button>
			    	<button
				        className="mdl-button mdl-js-button mdl-button--icon"
				        onClick={this._onCancelHandler}>
					    <i className="material-icons">clear</i>
					</button>
				</span>
			</td>
		);
	}
}

InlineTableInputDatePicker.propTypes = {
	defaultData: PropTypes.string.isRequired,
	onSubmitHandler: PropTypes.func
};
InlineTableInputDatePicker.defaultProps = {
	onSubmitHandler: () => {}
};

export default InlineTableInputDatePicker;
