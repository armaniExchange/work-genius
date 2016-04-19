// Libraries
import React, { Component, PropTypes } from 'react';
import Codemirror from 'react-codemirror';
import TextField from 'material-ui/lib/text-field';
import SelectField from 'material-ui/lib/SelectField';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Select from 'react-select';
import Dropzone from 'react-dropzone';

import ArticleFileList from '../../components/ArticleFileList/ArticleFileList';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog/ConfirmDeleteDialog';

// Styles
import './_ArticleEditor.css';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/htmlembedded/htmlembedded';
import 'codemirror/mode/sass/sass';
import 'codemirror/mode/python/python';
import 'codemirror/lib/codemirror.css';

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
    const allCategoriesMaxHeight = 300;
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
      allCategories,
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

    const allCategoryItems = allCategories
      .filter(item => {
        return item.name !== 'root';
      })
      .map((item, index) => {
        const path = item.path.replace('/root/', '').replace(/\//g, ' > ');
        return (
          <MenuItem
            key={index}
            value={item.id}
            primaryText={path}
          />
        );
      });
    const categoryErrorText = !category.id ? 'Category is required' : null;

    return (
      <div className="article-editor"
        {...this.props} >
        <TextField
          style={{width: '100%'}}
          hintText="Title"
          value={title}
          onChange={onTitleChange} />
        <br />
        <SelectField
          errorText={categoryErrorText}
          style={{width: '100%'}}
          autoWidth={false}
          maxHeight={allCategoriesMaxHeight}
          value={category.id}
          onChange={onCategoryChange} >
          {allCategoryItems}
        </SelectField>
        <br />
        <br />
        <label>Content</label>
        <div className="codemirror-wrapper">
          <Codemirror
            value={content}
            onChange={onContentChange}
            options={{mode: 'gfm'}} />
        </div>
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
  allCategories       : PropTypes.array,
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
  allCategories        : [],
  tagSuggestions      : [],
};

export default ArticleEditor;
