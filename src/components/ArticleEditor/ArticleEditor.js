// Libraries
import React, { Component, PropTypes } from 'react';
import Codemirror from 'react-codemirror';
import TextField from 'material-ui/lib/text-field';

// Styles
import './_ArticleEditor.css';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/lib/codemirror.css';

class ArticleEditor extends Component {

  onFileChange(event) {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = uploadEvent => {
      this.props.onFileUpload({
        name: file.name,
        type: file.type,
        data: uploadEvent.target.result
      });
    };

    reader.readAsDataURL(file);
  }

  render() {
    const {
      title,
      content,
      tags,
      category,
      onContentChange,
      onTitleChange,
      onTagsChange,
      onCategoryChange
    } = this.props;

    return (
      <div>
        <TextField
           hintText="Title"
           value={title}
           onChange={onTitleChange} />
        <br />
        <TextField
           hintText="Knowledge Category"
           value={category}
           onChange={onCategoryChange} />
        <br />
        <label>Content</label>
        <Codemirror
          value={content}
          onChange={onContentChange}
          options={{mode: 'gfm'}} />
        <TextField
           hintText="Important Tags"
           value={tags.join(',')}
           onChange={onTagsChange} />
        <br />
        <label>File Input</label>
        <input type="file" onChange={::this.onFileChange}/>
      </div>
    );
  }
}

ArticleEditor.propTypes = {
  id                  : PropTypes.string,
  title               : PropTypes.string,
  content             : PropTypes.string,
  tags                : PropTypes.arrayOf(PropTypes.string),
  category            : PropTypes.string,
  onContentChange     : PropTypes.func.isRequired,
  onTitleChange       : PropTypes.func.isRequired,
  onTagsChange        : PropTypes.func.isRequired,
  onCategoryChange    : PropTypes.func.isRequired,
  onFileUpload        : PropTypes.func.isRequired
};

ArticleEditor.defaultProps = {
  title               : '',
  content             : '',
  tags                : []
};

export default ArticleEditor;
