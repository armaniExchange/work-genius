// Libraries
import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/lib/text-field';
// import SelectField from 'material-ui/lib/SelectField';
// import MenuItem from 'material-ui/lib/menus/menu-item';
import Select from 'react-select';
import Dropzone from 'react-dropzone';

import ArticleFileList from '../../components/ArticleFileList/ArticleFileList';
import Editor from '../../components/Editor/Editor';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog/ConfirmDeleteDialog';

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
      category,
      files,
      allCategoriesOptions,
      tagSuggestions,
      onContentChange,
      onTitleChange,
      onTagsChange,
      onCategoryChange
    } = this.props;
    const {
      isConfirmDeleteFileDialogVisible,
      editingFile
    } = this.state;

    return (
      <div className="article-editor"
        {...this.props} >
        <TextField
          style={{width: '100%'}}
          hintText="Title"
          value={title}
          onChange={onTitleChange} />
        <br />
        <br />
        <label>Category</label>
        <Select
          value={category.id}
          options={allCategoriesOptions}
          onChange={onCategoryChange}/>
        {/*<SelectField
          errorText={categoryErrorText}
          style={{width: '100%'}}
          autoWidth={false}
          maxHeight={allCategoriesMaxHeight}
          value={category.id}
          onChange={onCategoryChange} >
          {allCategoryItems}
        </SelectField>*/}
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
  category            : PropTypes.object,
  files               : PropTypes.array,
  allCategoriesOptions: PropTypes.array,
  style               : PropTypes.object,
  tagSuggestions      : PropTypes.arrayOf(PropTypes.string),
  onContentChange     : PropTypes.func.isRequired,
  onTitleChange       : PropTypes.func.isRequired,
  onTagsChange        : PropTypes.func.isRequired,
  onCategoryChange    : PropTypes.func.isRequired,
  onFileUpload        : PropTypes.func.isRequired,
  onFileRemove        : PropTypes.func.isRequired
};

ArticleEditor.defaultProps = {
  title               : '',
  content             : '',
  category            : {},
  tags                : [],
  files               : [],
  allCategoriesOptions: [],
  tagSuggestions      : [],
};

export default ArticleEditor;
