// Style
import './_DataExplorerFolderView';
// React & Redux
import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// Components
import FolderBlock from '../../components/Folder-Block/Folder-Block';
import {
	Modal,
	Button
} from 'react-bootstrap';

class DataExplorerFolderView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false
		};
	}

	close() {
	    this.setState({ showModal: false });
	}

	open() {
	    this.setState({ showModal: true });
	}

	submit() {
		console.log('submit');
	    this.setState({ showModal: false });
	}

	render() {
		return (
			<div className="data-explorer-folder-view">
				<button className="btn btn-primary" onClick={::this.open}>
				    <i className="glyphicon glyphicon-plus"></i>
				    Add Folder
				</button>
				<Modal show={this.state.showModal} onHide={::this.close}>
				    <Modal.Header closeButton>
			            <Modal.Title>Add Folder</Modal.Title>
			        </Modal.Header>
			        <Modal.Body>
			            <span>New Folder Name: </span>
			            <input />
			        </Modal.Body>
			        <Modal.Footer>
			            <Button onClick={::this.submit}>Submit</Button>
			            <Button onClick={::this.close}>Cancel</Button>
			        </Modal.Footer>
				</Modal>
				<div className="data-explorer-folder-view data-explorer-folder-view__folder-blocks">
				    <FolderBlock
			        title="Test1"
			        link="/main/data-explorer/Test1" />
				    <FolderBlock
				        title="Test2"
				        link="/main/data-explorer/Test2"
				        color="red"
				        backgroundColor="black" />
				    <FolderBlock
				        title="Test1"
				        link="/main/data-explorer/Test1" />
				    <FolderBlock
				        title="Test2"
				        link="/main/data-explorer/Test2"
				        color="red"
				        backgroundColor="black" />
				</div>
			</div>
		);
	}
}

export default DataExplorerFolderView;
