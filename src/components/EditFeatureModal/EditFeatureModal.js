// Styles
import './EditFeatureModal.css';
// Libraries
import React, { Component, PropTypes } from 'react';
// import classnames from 'classnames';
import moment from 'moment';
// Components
import {
	Modal
} from 'react-bootstrap';

import util from '../../libraries/util';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import DatePicker from '../../components/A10-UI/Input/Date-Picker';
import DropDownList from '../../components/A10-UI/Input/Drop-Down-List';

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
		<RaisedButton label="Create" secondary={true} onClick={onSubmit} />
	);
	if (data.id) {
		confirmButtonHtml = (
			<RaisedButton label="Edit" secondary={true} onClick={onSubmit} />
		);
	}
	return (
		<Modal.Footer>
            {confirmButtonHtml}
            <RaisedButton label="Cancel" onClick={onCancelHandler} />
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
		let devPercent = this.refs.dev_percent.value;
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
		const { onSubmitHandler, formOptions } = this.props;
    let title = this.refs.title.value;
		let dev_id = this.refs.dev_id.value;
		let project = this.refs.project.value;
		let pri = this.refs.pri.value;
		let dev_percent = this.refs.dev_percent.value + '%';
		let eta = this.refs.eta.value;
		let owner_name = this.refs.owner_name.value;
		let dev_name = formOptions.devs.filter((dev) => dev.id === dev_id).map((user) => user.name)[0];
		let data = {
			title,
			dev_id,
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
	}
  _isValidPercent(val) {
    const MIN_PERCENT = 0;
    const MAX_PERCENT = 100;
    return util.isValidNumber(val, {min:MIN_PERCENT, max:MAX_PERCENT}); 
  }
	render() {
    const { show, data, onHideHandler, formOptions } = this.props;

		let today = moment().format('YYYY-MM-DD');
    let etaValue = data.eta || today;

    if (data && data.dev_percent) {
      data.dev_percent = data.dev_percent 
        && data.dev_percent.replace 
        && data.dev_percent.replace('%', '');  //<-- for <TextField type="number" ... /> of material-ui
    }

		return (
			<Modal show={show} onHide={onHideHandler}>
				<ModalHeader {...this.props} />
				<Modal.Body>
					<form className="form-horizontal">
					    <div>
							  <label className="col-xs-2 control-label">Title</label>
                <input type="hidden" ref="title" defaultValue={data.title || ''} />
					    	<div className="col-xs-9">
					    		<TextField onChange={(evt)=>{
                    this.refs.title.value = evt.target.value;
                  }} defaultValue={data.title || ''} />
					    	</div>
						  </div>
					    <div>
					    	<input type="hidden" ref="dev_id" defaultValue={data.dev_id || ''} />
							  <label className="col-xs-2 control-label">Developer</label>
					    	<div className="col-xs-9">
					    		<DropDownList title={data.dev_id || ''}
					    		  isDropDownListVisual2={true}
				            onOptionClick={(val)=>{
		                	this.refs.dev_id.value = val;
		                }}
				            aryOptionConfig={formOptions['devs'].map((item) => {
		                  return {title: item.name, value: item.id, subtitle: ''};
		                })} />
					    	</div>
						  </div>
					    <div>
					      <input type="hidden" ref="project" defaultValue={data.project || ''} />
							  <label className="col-xs-2 control-label">Project</label>
					    	<div className="col-xs-9">
					    	  <DropDownList title={data.project || ''}
					    		  isDropDownListVisual2={true}
		                onOptionClick={(val)=>{
		                	this.refs.project.value = val;
		                }}
		                aryOptionConfig={formOptions['project'].map((item) => {
		                	return {title: item, value: item, subtitle: ''};
		                })} />
					    	</div>
						  </div>
					    <div>
					      <input type="hidden" ref="pri" defaultValue={data.pri || ''} />
							  <label className="col-xs-2 control-label">Priority</label>
					    	<div className="col-xs-9">
					    		<DropDownList title={data.pri || ''}
					    	    isDropDownListVisual2={true}
		                onOptionClick={(val)=>{
		                	this.refs.pri.value = val;
		                }}
		                aryOptionConfig={formOptions['pri'].filter((val)=>{ //filter and remove empty value
		                	return !!val;
		                }).map((item) => {
		                	return {title: item, value: item, subtitle: ''};
		                })} />
					      </div>
						  </div>
					    <div>
                <input type="hidden" ref="dev_percent" defaultValue={
                  this._isValidPercent(data.dev_percent) ? data.dev_percent : ''
                } />
							  <label className="col-xs-2 control-label">Progress</label>
					      <div className="col-xs-9">
					        <TextField hintText="0 ~ 100" type="number" defaultValue={
                    this._isValidPercent(data.dev_percent) ? data.dev_percent : ''
                  } onChange={(evt)=>{
                    this.refs.dev_percent.value = evt.target.value;
                  }} />{'%'}
					      </div>
						  </div>

					    <input
					        className="hidden"
					        defaultValue={etaValue}
					        onChange={this._validateInput}
					        ref="eta" />
              <div>
						    <label className="col-xs-2 control-label">ETA</label>
						    <div className="col-xs-9">
						        <DatePicker defaultDate={etaValue} placeholder="ETA" onChange={(val)=>{
						    		this._onDateChange(val);
						    	}} />
						    </div>
						  </div>
					    <div>
					      <input type="hidden" ref="owner_name" defaultValue={data.owner_name || ''} />
							  <label className="col-xs-2 control-label">Assignee</label>
					    	<div className="col-xs-9">
					    		<DropDownList title={data.owner_name || ''}
					    		isDropDownListVisual2={true}
				                onOptionClick={(val)=>{
				                	this.refs.owner_name.value = val;
				                }}
				                aryOptionConfig={formOptions['owner_name'].map((item) => {
				                	return {title: item, value: item, subtitle: ''};
				                })} />
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
