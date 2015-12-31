// Styles
import './EditFeatureModal.css';
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

let ModalHeader = ({ data }) => {
	if (data.id) {
		return (
			<Modal.Header closeButton>
	            <Modal.Title>Edit Internal Feature</Modal.Title>
	        </Modal.Header>
		);
	}
	return (
		<Modal.Header closeButton>
            <Modal.Title>Create Internal Feature</Modal.Title>
        </Modal.Header>
	);
};

let ModalFooter = ({ data, onSubmit, onCancelHandler }) => {
	let confirmButtonHtml = (
		<Button onClick={onSubmit}>Create</Button>
	);
	if (data.id) {
		confirmButtonHtml = (
			<Button onClick={onSubmit}>Edit</Button>
		);
	}
	return (
		<Modal.Footer>
            {confirmButtonHtml}
            <Button onClick={onCancelHandler}>Cancel</Button>
        </Modal.Footer>
	);
};

class EditFeatureModal extends Component {
	constructor(props) {
		super(props);
		this._onSubmit = ::this._onSubmit;
		this._onDateChange = ::this._onDateChange;
		this._validateInput = ::this._validateInput;
		this.state = {
			isDevPercentInvalid: false,
			isEtaInvalid: false
		};
	}

	_validateInput() {
		let devPercent = this.refs.dev_percent.getValue();
		let eta = this.refs.eta.value;
		if (devPercent < 0 || devPercent > 100 || devPercent.includes('e') || !devPercent) {
			this.setState({
				isDevPercentInvalid: true
			});
			return false;
		} else if (!/^(\d{4}-\d{2}-\d{2})?$/gi.test(eta)) {
			this.setState({
				isEtaInvalid: true
			});
			return false;
		} else {
			this.setState({
				isDevPercentInvalid: false,
				isEtaInvalid: false
			});
			return true;
		}
	}

	_onSubmit() {
		const { onSubmitHandler } = this.props;
		let title = this.refs.title.getValue();
		let dev_name = this.refs.dev_name.getValue();
		let project = this.refs.project.getValue();
		let pri = this.refs.pri.getValue();
		let dev_percent = this.refs.dev_percent.getValue() + '%';
		let eta = this.refs.eta.value;
		let owner_name = this.refs.owner_name.getValue();
		let data = {
			title,
			dev_name,
			project,
			pri,
			dev_percent,
			eta,
			owner_name,
			type: 'internal'
		};
		let isInputValid = this._validateInput();

		if (isInputValid) {
			onSubmitHandler(data);
		}
	}
	_onDateChange(newDate) {
		this.refs.eta.value = newDate;
		this._validateInput();
	}

	render() {
		const { show, data, onHideHandler, formOptions } = this.props;
		let developerOptionsHtml = formOptions['dev_name'].map((developer, i) => {
			return (
				<option value={developer} key={i}>{developer}</option>
			);
		});
		let projectOptionsHtml = formOptions['project'].map((project, i) => {
			return (
				<option value={project} key={i}>{project}</option>
			);
		});
		let priorityOptionsHtml = formOptions['pri'].map((priority, i) => {
			return (
				<option value={priority} key={i}>{priority}</option>
			);
		});
		let assigneeOptionsHtml = formOptions['owner_name'].map((assignee, i) => {
			return (
				<option value={assignee} key={i}>{assignee}</option>
			);
		});
		let etaClassName = classnames({
			'form-group': true,
			'has-error': this.state.isEtaInvalid
		});
		return (
			<Modal show={show} onHide={onHideHandler}>
				<ModalHeader {...this.props} />
				<Modal.Body>
					<form className="form-horizontal">
					    <Input
					        type="text"
					        label="Title"
					        labelClassName="col-xs-2"
					        wrapperClassName="col-xs-10"
					        defaultValue={data.title ? data.title : ''}
					        ref="title"/>
					    <Input
					        type="select"
					        label="Developer"
					        labelClassName="col-xs-2"
					        wrapperClassName="col-xs-10"
					        defaultValue={data.dev_name ? data.dev_name : ''}
					        ref="dev_name">
					        {developerOptionsHtml}
					    </Input>
					    <Input
					        type="select"
					        label="Project"
					        labelClassName="col-xs-2"
					        wrapperClassName="col-xs-10"
					        defaultValue={data.project ? data.project : ''}
					        ref="project">
					        {projectOptionsHtml}
					    </Input>
					    <Input
					        type="select"
					        label="Priority"
					        labelClassName="col-xs-2"
					        wrapperClassName="col-xs-10"
					        defaultValue={data.pri ? data.pri : ''}
					        ref="pri">
					        {priorityOptionsHtml}
					    </Input>
					    <Input
					        type="number"
					        min={0}
					        max={100}
					        label="Progress"
					        labelClassName="col-xs-2"
					        wrapperClassName="col-xs-10"
					        defaultValue={data.dev_percent ? parseInt(data.dev_percent, 10) : 0}
					        bsStyle={this.state.isDevPercentInvalid ? 'error' : undefined}
					        onChange={this._validateInput}
					        ref="dev_percent" />
					    <input
					        className="hidden"
					        defaultValue={data.eta || moment().format('YYYY-MM-DD')}
					        onChange={this._validateInput}
					        ref="eta" />
					    <div className={etaClassName}>
						    <label className="col-xs-2 control-label">ETA</label>
						    <div className="col-xs-10">
						        <DateTimeField
						            dateTime={data.eta || moment().format('YYYY-MM-DD')}
						            format="YYYY-MM-DD"
						            inputFormat="YYYY-MM-DD"
						            mode="date"
						            showToday
						            onChange={this._onDateChange} />
						    </div>
						</div>
					    <Input
					        type="select"
					        label="Assignee"
					        labelClassName="col-xs-2"
					        wrapperClassName="col-xs-10"
					        defaultValue={data.owner_name ? data.owner_name : ''}
					        ref="owner_name">
					        {assigneeOptionsHtml}
					    </Input>
					</form>
		        </Modal.Body>
		        <ModalFooter
		        	onSubmit={this._onSubmit}
		            {...this.props} />
			</Modal>
		);
	}
};

EditFeatureModal.propTypes = {
	formOptions     : PropTypes.object.isRequired,
	data            : PropTypes.object,
	show            : PropTypes.bool,
	onHideHandler   : PropTypes.func,
	onSubmitHandler : PropTypes.func,
	onCancelHandler : PropTypes.func
};

EditFeatureModal.defaultProps = {
	data            : {},
	show            : false,
	onHideHandler   : () => {},
	onSubmitHandler : () => {},
	onCancelHandler : () => {}
};

export default EditFeatureModal;
