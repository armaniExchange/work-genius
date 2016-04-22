// Libraries
import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/lib/text-field';
import Select from 'react-select';
import Dropzone from 'react-dropzone';

import ArticleFileList from '../../components/ArticleFileList/ArticleFileList';
import Editor from '../../components/Editor/Editor';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog/ConfirmDeleteDialog';
import ArticleDocumentTypeSelect from '../../components/ArticleDocumentTypeSelect/ArticleDocumentTypeSelect';
import ArticlePrioritySelect from '../../components/ArticlePrioritySelect/ArticlePrioritySelect';
import ArticleMilestoneSelect from '../../components/ArticleMilestoneSelect/ArticleMilestoneSelect';

// Styles
import './_ArticleEditor.css';

class ArticleEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isConfirmDeleteFileDialogVisible: false,
      editingFile: null
    };
  }

  onFileChange(files) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.props.onFileUpload(file);
    };
    reader.readAsDataURL(file);
  }

  onFileRemove(file) {
    this.setState({
      isConfirmDeleteFileDialogVisible: true,
      editingFile: file
    });
  }

  onConfirmDeleteFile(file) {
    this.props.onFileRemove(file);
  }

  onCancelDeleteFile() {

  }

  onConfirmDeleteFileDialogRequestHide() {
    this.setState({
      isConfirmDeleteFileDialogVisible: false,
      editingFile:  null
    });
  }

  render() {
    const dropzoneStyle = {
      width: '100%',
      border: '2px dashed gray',
      padding: '2em 1em',
      boxSizing: 'border-box'
    };
    const {
      title,
      content,
      tags,
      categoryId,
      files,
      reportTo,
      allCategoriesOptions,
      tagSuggestions,
      onTitleChange,
      documentType,
      priority,
      milestone,
      onDocumentTypeChange,
      onPriorityChange,
      onMilestoneChange,
      onReportToChange,
      onContentChange,
      onTagsChange,
      onCategoryIdChange
    } = this.props;
    const {
      isConfirmDeleteFileDialogVisible,
      editingFile
    } = this.state;

    const hidePriorityAndMilestoneSelectStyle = !documentType || documentType === 'knowledges' ?
      {visibility: 'hidden'} : null;

    return (
      <div className="article-editor"
        {...this.props} >
        <TextField
          style={{width: '100%'}}
          hintText="Title"
          errorText={!title && 'This field is required'}
          value={title}
          onChange={onTitleChange} />
        <br />
        <div className="select-field-group">
          <ArticleDocumentTypeSelect
            value={documentType}
            onChange={onDocumentTypeChange}
          />
          <ArticlePrioritySelect
            style={hidePriorityAndMilestoneSelectStyle}
            value={priority}
            onChange={onPriorityChange}
          />
          <ArticleMilestoneSelect
            style={hidePriorityAndMilestoneSelectStyle}
            value={milestone}
            onChange={onMilestoneChange}
          />
        </div>
        <br />
        <label>Category</label>
        {!categoryId && <small style={{color: 'red'}}>&nbsp;&nbsp;<span>*</span> This field is required</small>}
        <Select
          placeholder="Category is required field"
          value={categoryId}
          options={allCategoriesOptions}
          onChange={onCategoryIdChange}/>
        <label>Report To</label>
        <Select
          multi={true}
          allowCreate={true}
          value={reportTo.map( item => {return {value: item, label: item};})}
          onChange={onReportToChange}
        />
        <br />
        <label>Content</label>
        <Editor
          value={content}
          onChange={onContentChange} />
        <br />
        <label>Tags</label>
        <Select
          multi={true}
          allowCreate={true}
          value={tags.map(tag => {return {value: tag, label: tag};})}
          options={tagSuggestions.map(tag => {return {value: tag, label: tag};})}
          onChange={onTagsChange}
        />
        <br />
        <label>Attachments</label>
        <br />
        <ArticleFileList
          files={files}
          enableRemove={true}
          onRemove={::this.onFileRemove} />
        <Dropzone
          style={dropzoneStyle}
          onDrop={::this.onFileChange}>
          <div>Try dropping some files here, or click to select files to upload.</div>
        </Dropzone>
        <ConfirmDeleteDialog
          open={isConfirmDeleteFileDialogVisible}
          data={editingFile}
          onConfirm={::this.onConfirmDeleteFile}
          onCancel={::this.onCancelDeleteFile}
          onRequestClose={::this.onConfirmDeleteFileDialogRequestHide} />
      </div>
    );
  }
}

ArticleEditor.propTypes = {
  id                  : PropTypes.string,
  title               : PropTypes.string,
  content             : PropTypes.string,
  tags                : PropTypes.arrayOf(PropTypes.string),
  categoryId          : PropTypes.string,
  files               : PropTypes.array,
  allCategoriesOptions: PropTypes.array,
  style               : PropTypes.object,
  documentType        : PropTypes.string,
  priority            : PropTypes.string,
  milestone           : PropTypes.string,
  reportTo            : PropTypes.arrayOf(PropTypes.string),
  tagSuggestions      : PropTypes.arrayOf(PropTypes.string),
  onContentChange     : PropTypes.func.isRequired,
  onTitleChange       : PropTypes.func.isRequired,
  onTagsChange        : PropTypes.func.isRequired,
  onCategoryIdChange  : PropTypes.func.isRequired,
  onFileUpload        : PropTypes.func.isRequired,
  onFileRemove        : PropTypes.func.isRequired,
  onDocumentTypeChange: PropTypes.func.isRequired,
  onPriorityChange    : PropTypes.func.isRequired,
  onMilestoneChange   : PropTypes.func.isRequired,
  onReportToChange    : PropTypes.func.isRequired
};

ArticleEditor.defaultProps = {
  title               : '',
  content             : '',
  categoryId          : '',
  tags                : [],
  files               : [],
  allCategoriesOptions: [],
  reportTo            : []
};

export default ArticleEditor;
