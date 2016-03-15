// Libraries
import React, { Component, PropTypes } from 'react';
import Codemirror from 'react-codemirror';

// Styles
import './_ArticleEditor.css';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/lib/codemirror.css';

class ArticleEditor extends Component {
  render() {
    const {
      title,
      content,
      onContentChange,
      onTitleChange
    } = this.props;

    return (
      <div>
        <div className="mdl-textfield mdl-js-textfield">
          <input className="mdl-textfield__input"
            type="text"
            id="articleTitle"
            value={title}
            onChange={onTitleChange}/>
          <label className="mdl-textfield__label" htmlFor="articleTitle">Title</label>
        </div>
        <Codemirror
          value={content}
          onChange={onContentChange}
          options={{mode: 'gfm'}}/>
      </div>
    );
  }
}

ArticleEditor.propTypes = {
  title             : PropTypes.string,
  content           : PropTypes.string,
  tags              : PropTypes.array,
  onContentChange   : PropTypes.func.isRequired,
  onTitleChange     : PropTypes.func.isRequired
};

ArticleEditor.defaultProps = {
  title             : '',
  content             : '',
  tags              : []
};

export default ArticleEditor;
