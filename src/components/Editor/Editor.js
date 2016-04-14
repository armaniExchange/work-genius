// Libraries
import React, { Component, PropTypes } from 'react';
import Codemirror from 'react-codemirror';

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
  render() {
    const {
      value,
      onChange,
      options
    } = this.props;
    return (
      <div className="component-editor" {...this.props}>
        <Codemirror
          options={options}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }
}

Editor.propTypes = {
  value                : PropTypes.string.isRequired,
  options              : PropTypes.object,
  onChange             : PropTypes.func.isRequired,
};

Editor.defaultProps = {
  value                : '',
  options              : { mode: 'gfm' }
};

export default Editor;
