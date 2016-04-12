import React, { Component, PropTypes } from 'react';

// Components
import {
	Modal
} from 'react-bootstrap';
import RaisedButton from 'material-ui/lib/raised-button';

let ModalHeader = () => {
	return (
		<Modal.Header closeButton>
            <Modal.Title>Append A Work Log</Modal.Title>
        </Modal.Header>
	);
};

let ModalFooter = ({onCancelHandler}) => {
	return (
		<Modal.Footer>
            <RaisedButton label="Apply" secondary={true} />
            <RaisedButton label="Cancel" onClick={onCancelHandler}/>
        </Modal.Footer>
	);
};

class ResourceMapModalWorkLog extends Component {

	constructor() {
		super();
		this._onCloseModelHandler = ::this._onCloseModelHandler;
	}

	_onCloseModelHandler() {
		const { onModalHander } = this.props;
		onModalHander(false);
	}

	render() {
		const {
			show
		} = this.props;
		return (
			<Modal show={show}>
				<ModalHeader />
				<ModalFooter onCancelHandler={this._onCloseModelHandler}/>
			</Modal>
		);
	}
}

ResourceMapModalWorkLog.propTypes = {
	show             : PropTypes.bool.isRequired,
	onModalHander  : PropTypes.func.isRequired
};

ResourceMapModalWorkLog.defaultProps = {
	show              : false,
	onCancelHandler   : () => {}
};

export default ResourceMapModalWorkLog;
