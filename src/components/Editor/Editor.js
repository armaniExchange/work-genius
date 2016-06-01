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
      editorId: _.uniqueId('editor-'),
      enablePreview: false,
      valueFromCodeMirror: null
    };
  }

  componentDidMount() {
    const { editorId } = this.state;
    /*eslint-disable */
    new window.MaterialTabs(document.getElementById(`editor-${editorId}`));
    /*eslint-enable  */
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.valueFromCodeMirror && this.props.value !== nextProps.value) {
      const cm = this.refs.codeMirror.getCodeMirror();
      const { top, left } = cm.getScrollInfo();
      const { line, ch } = cm.getCursor();
      cm.setValue(nextProps.value);
      cm.scrollTo(left, top);
      cm.setCursor(line, ch);
    }
  }

  onEditPanelButtonClick() {
    this.setState({ enablePreview: false });
  }

  onPreviewPanelButtonClick() {
    this.setState({ enablePreview: true });
  }

  getPosition(str, m, i) {
     return str.split(m, i).join(m).length;
  }

  getValueOfInsertedStringAtCursor(str) {
    const { doc }= this.refs.codeMirror.codeMirror;
    const { line, ch } = doc.getCursor();
    const value = doc.getValue();
    const cursorPosition = this.getPosition(value, '\n', line) + ch + 1;
    return `${value.slice(0, cursorPosition)}${str}${value.slice(cursorPosition)}`;
  }

  onChange(value) {
    this.setState({ valueFromCodeMirror: value });
    this.props.onChange.apply(this, arguments);
  }

  render() {
    const {
      value,
      options,
      placeholder,
    } = this.props;
    const {
      editorId,
      enablePreview
    } = this.state;
    return (
      <div
        id={`editor-${editorId}`}
        className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect component-editor" >
        <div className="mdl-tabs__tab-bar">
          <a href={`#${editorId}-edit-panel`}
            onClick={::this.onEditPanelButtonClick}
            className={`mdl-tabs__tab is-active ${editorId}-edit-edit-button`}>
            Edit
          </a>
          <a href={`#${editorId}-preview-panel`}
            onClick={::this.onPreviewPanelButtonClick}
            className="mdl-tabs__tab">
            Preview
          </a>
          <a className="help"
            target="_blank"
            href="/main/knowledge/document/markdown-cheatsheet" >
            Help
          </a>
        </div>
        <div id={`${editorId}-edit-panel`}
          className="mdl-tabs__panel is-active component-edit-panel is-active">
            <Codemirror
              ref="codeMirror"
              options={options}
              value={value}
              onChange={::this.onChange}
            />
            {
              (placeholder && !value) && (
                <div className="placeholder">{placeholder}</div>
              )
            }
        </div>
        <div id={`${editorId}-preview-panel`} className="mdl-tabs__panel component-preview-panel" >
          {enablePreview ? <HighlightMarkdown source={value} /> : null}
        </div>
      </div>
    );
  }
}

Editor.propTypes = {
  value                : PropTypes.string.isRequired,
  options              : PropTypes.object,
  onChange             : PropTypes.func.isRequired,
  placeholder          : PropTypes.string
};

Editor.defaultProps = {
  value                : '',
  options              : { mode: 'gfm' }
};

export default Editor;
