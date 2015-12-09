// Styles
import './_ErrorBox.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
// Components
import {
	Button,
	Modal
} from 'react-bootstrap';

class ErrorBox extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { show, errorMessage, onHideHandler, onConfirmHandler } = this.props;
		return (
			<Modal show={show} onHide={onHideHandler}>
			    <Modal.Header closeButton>
		            <Modal.Title>Something is Wrong!</Modal.Title>
		        </Modal.Header>
		        <Modal.Body>
					{ errorMessage }
		        </Modal.Body>
		        <Modal.Footer>
		            <Button onClick={onConfirmHandler}>OK</Button>
		        </Modal.Footer>
			</Modal>
		);
	}
};

ErrorBox.propTypes = {
	show            : PropTypes.bool,
	errorMessage    : PropTypes.string,
	onHideHandler   : PropTypes.func,
	onConfirmHandler: PropTypes.func
};

ErrorBox.defaultProps = {
	show            : false,
	errorMessage    : '',
	onHideHandler   : () => {},
	onConfirmHandler: () => {}
};

export default ErrorBox;
