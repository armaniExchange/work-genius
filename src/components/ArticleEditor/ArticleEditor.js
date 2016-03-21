// Libraries
import React, { Component, PropTypes } from 'react';
import Codemirror from 'react-codemirror';
import TextField from 'material-ui/lib/text-field';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';

import ArticleFileList from '../../components/ArticleFileList/ArticleFileList';

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
    const allCategoriesMaxHeight = 300;
    const {
      title,
      content,
      tags,
      category,
      files,
      allCategories,
      onFileRemove,
      onContentChange,
      onTitleChange,
      onTagsChange,
      onCategoryChange,
      style
    } = this.props;

    const wrapperStyle = Object.assign({}, {
      background: 'white',
      borderRadius: 5,
      border: '1px solid lightgray',
      padding: 15,
    }, style);

    const codemirrorStyle = {
      borderRadius: 5,
      border: '1px solid lightgray',
      background: 'none',
      overflow: 'hidden'
    };

    return (
      <div {...this.props} style={wrapperStyle}>
        <TextField
           hintText="Title"
           value={title}
           onChange={onTitleChange} />
        <br />
        <DropDownMenu
          style={{marginLeft: -20, width: 300}}
          autoWidth={false}
          maxHeight={allCategoriesMaxHeight}
          value={category.id}
          onChange={onCategoryChange} >
          {
            allCategories.map((item, index) => {
              return (
                <MenuItem
                  key={index}
                  value={item.id}
                  primaryText={item.name}
                />
              );
            })
          }
        </DropDownMenu>
        <br />
        <br />
        <label>Content</label>
        <div style={codemirrorStyle}>
          <Codemirror
            value={content}
            onChange={onContentChange}
            options={{mode: 'gfm'}} />
        </div>
        <br />
        <TextField
           hintText="Important Tags"
           value={tags.join(',')}
           onChange={onTagsChange} />
        <br />
        <h5>File Input</h5>
        <ArticleFileList
          files={files}
          enableRemove={true}
          onRemove={onFileRemove}/>
        <br />
        <br />
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
  category            : PropTypes.object,
  files               : PropTypes.array,
  allCategories       : PropTypes.array,
  style               : PropTypes.object,
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
  tags                : [],
  files               : [],
  allCategorie        : []
};

export default ArticleEditor;
