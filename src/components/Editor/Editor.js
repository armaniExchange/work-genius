// Libraries
import React, { Component, PropTypes } from 'react';
import Codemirror from 'react-codemirror';
import _ from 'lodash';


import HighlightMarkdown from '../HighlightMarkdown/HighlightMarkdown';

// Styles
import './_Editor.css';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/htmlembedded/htmlembedded';
import 'codemirror/mode/sass/sass';
import 'codemirror/mode/python/python';
import 'codemirror/lib/codemirror.css';

class Editor extends Component {

  constructor(props){
    super(props);
    this.state = {
      editorId: _.uniqueId('editor-')
    };
  }

  componentDidMount() {
    const { editorId } = this.state;
    document.getElementsByClassName(`${editorId}-edit-edit-button`)[0].click();
  }

  render() {
    const {
      value,
      onChange,
      options,
      placeholder,
      height
    } = this.props;
    const { editorId } = this.state;
    return (
      <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect component-editor">
        <div className="mdl-tabs__tab-bar">
          <a href={`#-${editorId}-edit-panel`}
            className={`mdl-tabs__tab is-active ${editorId}-edit-edit-button`}>
            Edit
          </a>
          <a href={`#${editorId}-preview-panel`} className="mdl-tabs__tab">Preview</a>
          <a className="help"
            target="_blank"
            href="https://guides.github.com/features/mastering-markdown/" >
            Help
          </a>
        </div>
        <div id={`-${editorId}-edit-panel`}
          style={{height}}
          className="mdl-tabs__panel is-active component-edit-panel is-active">
            <Codemirror
              options={options}
              value={value}
              onChange={onChange}
            />
            {
              (placeholder && !value) && (
                <div className="placeholder">{placeholder}</div>
              )
            }
        </div>
        <div id={`${editorId}-preview-panel`} className="mdl-tabs__panel component-preview-panel" >
          <HighlightMarkdown source={value} />
        </div>
      </div>
    );
  }
}

Editor.propTypes = {
  value                : PropTypes.string.isRequired,
  options              : PropTypes.object,
  onChange             : PropTypes.func.isRequired,
  placeholder          : PropTypes.string,
  height               : PropTypes.number
};

Editor.defaultProps = {
  value                : '',
  options              : { mode: 'gfm' },
  height               : 200
};

export default Editor;
