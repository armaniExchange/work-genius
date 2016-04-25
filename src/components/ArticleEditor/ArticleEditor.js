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
      isArticleFormValid: false,
      editingFile: null,
      enableTitleError: false,
      enableDocumentTypeError: false,
      enableCategoryError: false,
      enableContentError: false
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

  onTitleChange() {
    this.props.onTitleChange.apply(this, arguments);
    this.setState({enableTitleError: true});
    this.triggerValidFormChange();
  }

  onCategoryIdChange() {
    this.props.onCategoryIdChange.apply(this, arguments);
    this.setState({enableCategoryError: true});
    this.triggerValidFormChange();
  }

  onContentChange() {
    this.props.onContentChange.apply(this, arguments);
    this.setState({enableContentError: true});
    this.triggerValidFormChange();
  }

  onDocumentTypeChange() {
    this.props.onDocumentTypeChange.apply(this, arguments);
    this.setState({enableDocumentTypeError: true});
    this.triggerValidFormChange();
  }

  triggerValidFormChange(){
    const {
      title,
      categoryId,
      content,
      documentType,
      onValidFormChange
    } = this.props;
    const isValid = title.trim() && categoryId && content.trim() && documentType;
    onValidFormChange(isValid);
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
      documentType,
      priority,
      milestone,
      onPriorityChange,
      onMilestoneChange,
      onReportToChange,
      onTagsChange
    } = this.props;
    const {
      isConfirmDeleteFileDialogVisible,
      enableTitleError,
      enableDocumentTypeError,
      enableCategoryError,
      enableContentError,
      editingFile
    } = this.state;
    const isDocumentTypeKnowlegesOrNull = !documentType || documentType === 'knowledges';
    const hidePriorityAndMilestoneSelectStyle =  isDocumentTypeKnowlegesOrNull ?
      {visibility: 'hidden'} : null;

    return (
      <div className="article-editor"
        {...this.props} >
        <TextField
          style={{width: '100%'}}
          hintText="Title"
          errorText={enableTitleError && !title && 'This field is required'}
          value={title}
          onChange={::this.onTitleChange} />
        <br />
        <div className="select-field-group">
          <ArticleDocumentTypeSelect
            value={documentType}
            errorText={enableDocumentTypeError && !documentType && 'This field is required'}
            onChange={::this.onDocumentTypeChange}
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
        <small style={{color: 'red'}}>
          <span>&nbsp;&nbsp;*</span>
          {enableCategoryError && !categoryId && <span> This field is required</span>}
        </small>

        <Select
          placeholder="Category is required field"
          value={categoryId}
          options={allCategoriesOptions}
          onChange={::this.onCategoryIdChange}/>

        {
          isDocumentTypeKnowlegesOrNull ? null : (
            <div className="report-to" style={{position: 'relative'}}>
              <br />
              <label>Report To</label>
              <div className="wrapper">
                <Select
                  multi={true}
                  allowCreate={true}
                  value={reportTo.map( item => {return {value: item, label: item};})}
                  addLabelText={'Add "{label}"@a10networks.com?'}
                  onChange={onReportToChange}
                />
                <span className="postfix-email">@a10networks.com</span>
              </div>
            </div>
          )
        }

        <br />
        <label>Content</label>
        <small style={{color: 'red'}}>
          <span>&nbsp;&nbsp;*</span>
          {enableContentError && !content.trim() && <span> This field is required</span>}
        </small>

        <Editor
          height={400}
          value={content}
          onChange={::this.onContentChange} />
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
  onReportToChange    : PropTypes.func.isRequired,
  onValidFormChange   : PropTypes.func
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
