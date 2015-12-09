/**
 * @author Howard Chang
 */

// Style
import './_DataExplorerFileView';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Components
import Dropzone from 'react-dropzone';
import {
	Modal,
	Button
} from 'react-bootstrap';
// Actions
import * as DataExplorerPageActions from '../../actions/data-explorer-page-actions';

class DataExplorerFileView extends Component {
	constructor(props) {
		super(props);
		this._onDrop = ::this._onDrop;
		this._openUploadFileModal = ::this._openUploadFileModal;
		this._closeUploadFileModal = ::this._closeUploadFileModal;
		this._uploadFileModalSubmitHandler = ::this._uploadFileModalSubmitHandler;
		this._renderDropZoneHint = ::this._renderDropZoneHint;
	}

	_onDrop(files) {
		const { saveFilesToUploadCache } = this.props.dataExplorerActions;
		saveFilesToUploadCache(files);
	}

	_closeUploadFileModal() {
		const { toggleUploadFileModal, clearUploadCache } = this.props.dataExplorerActions;
		clearUploadCache();
	    toggleUploadFileModal();
	}

	_openUploadFileModal() {
	    this.props.dataExplorerActions.toggleUploadFileModal();
	}

	_uploadFileModalSubmitHandler() {
		const { uploadFile, toggleUploadFileModal } = this.props.dataExplorerActions;
		const { uploadFilesCache } = this.props.dataExplorerState;
		toggleUploadFileModal();
		uploadFile(uploadFilesCache[0]);
	}

	_renderDropZoneHint() {
		const { uploadFilesCache } = this.props.dataExplorerState;
		let result = null;

		if (uploadFilesCache.length) {
			let file = uploadFilesCache[0];
			result = (
				<div>
					<h5>Dropped:</h5>
				    <img src={file.preview} />
				    {file.name}: {file.size} bytes
				</div>
			);
		}

		return result;
	}

	render() {
		const { params } = this.props;
		const { showUploadFileModal } = this.props.dataExplorerState;

		let dropZoneHintHTML = this._renderDropZoneHint();

		return (
			<div className="data-explorer-file-view">
				<h1>{params.folderName}</h1>
				<button className="btn btn-primary" onClick={this._openUploadFileModal}>
				    <i className="fa fa-upload"></i>
				    Upload File
				</button>
				<Modal show={showUploadFileModal} onHide={this._closeUploadFileModal}>
				    <Modal.Header closeButton>
			            <Modal.Title>Upload File</Modal.Title>
			        </Modal.Header>
			        <Modal.Body>
						<Dropzone onDrop={this._onDrop}>
			                <div>Drop files here, or click to select files to upload.</div>
			            </Dropzone>
			            { dropZoneHintHTML }
			        </Modal.Body>
			        <Modal.Footer>
			            <Button onClick={this._uploadFileModalSubmitHandler}>Submit</Button>
			            <Button onClick={this._closeUploadFileModal}>Cancel</Button>
			        </Modal.Footer>
				</Modal>
			</div>
		);
	}
}

// Params prop is coming from react router
DataExplorerFileView.propTypes = {
	params: PropTypes.object.isRequired,
	dataExplorerState: PropTypes.object.isRequired,
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
)(DataExplorerFileView);
