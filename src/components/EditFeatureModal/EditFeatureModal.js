// Styles
import './EditFeatureModal.css';
// Libraries
import React, { Component, PropTypes } from 'react';
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
		onSubmitHandler(data);
	}
	_onDateChange(newDate) {
		this.refs.eta.value = newDate;
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
					        ref="dev_percent" />
					    <input className="hidden" ref="eta" defaultValue={data.eta ? data.eta : moment().format('YYYY-MM-DD')} />
					    <div className="form-group">
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
