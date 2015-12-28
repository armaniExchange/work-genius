// Styles
import './AlertBox.css';
// React & Redux
import React, { Component, PropTypes } from 'react';
// Components
import {
	Button,
	Modal
} from 'react-bootstrap';

let ModalHeader = ({ type }) => {
	if (type === 'error') {
		return (
			<Modal.Header closeButton>
	            <Modal.Title>Something is Wrong!</Modal.Title>
	        </Modal.Header>
		);
	}
	return (<div></div>);
};

let ModalFooter = ({ type, onConfirmHandler, onCancelHandler }) => {
	if (type === 'error') {
		return (
			<Modal.Footer>
	            <Button onClick={onConfirmHandler}>OK</Button>
	        </Modal.Footer>
		);
	} else {
		return (
			<Modal.Footer>
	            <Button onClick={onConfirmHandler}>OK</Button>
	            <Button onClick={onCancelHandler}>Cancel</Button>
	        </Modal.Footer>
		);
	}
};

class AlertBox extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { show, message, onHideHandler } = this.props;
		return (
			<Modal show={show} onHide={onHideHandler}>
				<ModalHeader {...this.props} />
		        <Modal.Body>
					{ message }
		        </Modal.Body>
		        <ModalFooter {...this.props} />
			</Modal>
		);
	}
};

AlertBox.propTypes = {
	type            : PropTypes.oneOf(['error', 'warning']).isRequired,
	show            : PropTypes.bool,
	message         : PropTypes.string,
	onHideHandler   : PropTypes.func,
	onConfirmHandler: PropTypes.func,
	onCancelHandler : PropTypes.func
};

AlertBox.defaultProps = {
	show            : false,
	message         : '',
	onHideHandler   : () => {},
	onConfirmHandler: () => {},
	onCancelHandler : () => {}
};

export default AlertBox;
