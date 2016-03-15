/**
 * @author Howard Chang
 */

// Style
import './_DataExplorerFolderView.css';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Components
import FolderBlock from '../../components/Folder-Block/Folder-Block';
import {
	Modal,
	Button
} from 'react-bootstrap';
// Actions
import * as DataExplorerPageActions from '../../actions/data-explorer-page-actions';

class DataExplorerFolderView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false
		};
		this._renderFolders = ::this._renderFolders;
		this._openAddFolderModal = ::this._openAddFolderModal;
		this._closeAddFolderModal = ::this._closeAddFolderModal;
		this._AddFolderModalSubmitHandler = ::this._AddFolderModalSubmitHandler;
		this._folderBlockCloseHandler = ::this._folderBlockCloseHandler;
	}

	_closeAddFolderModal() {
		const { toggleAddFolderModal, setFolderModalErrorMessage } = this.props.dataExplorerActions;
	    toggleAddFolderModal();
		setFolderModalErrorMessage('');
	}

	_openAddFolderModal() {
	    this.props.dataExplorerActions.toggleAddFolderModal();
	}

	_AddFolderModalSubmitHandler() {
		const { folders } = this.props.dataExplorerState;
		const { addNewFolder, toggleAddFolderModal, setFolderModalErrorMessage } = this.props.dataExplorerActions;
		let newFolderName = this.refs.newFolderName.value;
		let isRepeated = Object.keys(folders).some((folder) => folder === newFolderName);
		let isInputEmpty = !newFolderName;
		let isInputValid = /^[a-zA-Z0-9-_]+$/.test(newFolderName);

		if (isRepeated) {
			setFolderModalErrorMessage('Folder already exists!');
		} else if (isInputEmpty) {
			setFolderModalErrorMessage('Input cannot be empty!');
		} else if (!isInputValid) {
			setFolderModalErrorMessage(`Input can only consist of alphanumerics, '-' and '_'`);
		} else {
			setFolderModalErrorMessage('');
		    addNewFolder(newFolderName);
	        toggleAddFolderModal();
		}
	}

	_folderBlockCloseHandler(title) {
		const { deleteFolder } = this.props.dataExplorerActions;
		deleteFolder(title);
	}

	_renderFolders() {
		const { folders } = this.props.dataExplorerState;
		let folderNames = Object.keys(folders);

		if (!folderNames.length) {
			return (
				<div>
				    There are currently no folders :(
				</div>
			);
		} else {
			return folderNames.map((folder, i) => {
				return (
					<FolderBlock
					    key={i}
				        title={folder}
				        link={`/main/data-explorer/${folder}`}
				        showCloseButton
				        onCloseHandler={this._folderBlockCloseHandler} />
				);
			});
		}
	}

	render() {
		const { showAddFolderModal, folderModalErrorMessage } = this.props.dataExplorerState;
		const foldersHTML = this._renderFolders();
		const folderModalInputClass = folderModalErrorMessage ? 'form-group has-error' : 'form-group';
		return (
			<div className="data-explorer-folder-view">
				<button className="btn btn-primary" onClick={this._openAddFolderModal}>
				    <i className="glyphicon glyphicon-plus"></i>
				    Add Folder
				</button>
				<Modal show={showAddFolderModal} onHide={this._closeAddFolderModal}>
				    <Modal.Header closeButton>
			            <Modal.Title>Add Folder</Modal.Title>
			        </Modal.Header>
			        <Modal.Body>
			            <div className={folderModalInputClass}>
					        <label>New Folder Name: </label>
					        <input
					            ref="newFolderName"
					            className="form-control"
					            placeholder="New Folder Name" />
					        <span className="help-block">{folderModalErrorMessage}</span>
					    </div>
			        </Modal.Body>
			        <Modal.Footer>
			            <Button onClick={this._AddFolderModalSubmitHandler}>Submit</Button>
			            <Button onClick={this._closeAddFolderModal}>Cancel</Button>
			        </Modal.Footer>
				</Modal>
				<div className="data-explorer-folder-view data-explorer-folder-view__folder-blocks">
				    {foldersHTML}
				</div>
			</div>
		);
	}
}

DataExplorerFolderView.propTypes = {
	dataExplorerState  : PropTypes.object.isRequired,
	dataExplorerActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return {
		dataExplorerState: state.dataExplorer.toJS()
	};
}

function mapDispatchToProps(dispatch) {
	return {
		dataExplorerActions: bindActionCreators(DataExplorerPageActions, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DataExplorerFolderView);
