// Libraries
import React, { Component, PropTypes } from 'react';

// Styles
import './_FeatureAutomationRowInlineToolbar.css';

class FeatureAutomationRowInlineToolbar extends Component {

  onSave(event) {
    event.preventDefault();
    const {
      disabledSave,
      onSave
    } = this.props;
    if (!disabledSave) {
      onSave(event);
    };
  }

  onCancel(event) {
    event.preventDefault();
    this.props.onCancel(event);
  }

  render() {
    const {
      show,
      disabledSave
    } = this.props;
    const saveButtonStyle = disabledSave ? {color: 'gray'} : null;
    return show ? (
      <div className="feature-automation-row-inline-toolbar">
        <a href="#"
          className="button"
          style={saveButtonStyle}
          onClick={::this.onSave} >
          <i className="fa fa-save" />&nbsp;Save
        </a>
        <a href="#"
          className="button"
          onClick={::this.onCancel} >
          <i className="fa fa-times" />&nbsp;Cancel
        </a>
      </div>
    ) : null;
  }
}

FeatureAutomationRowInlineToolbar.propTypes = {
  onSave                    : PropTypes.func,
  onCancel                  : PropTypes.func,
  disabledSave              : PropTypes.bool,
  show                      : PropTypes.bool,
};

FeatureAutomationRowInlineToolbar.defaultProps = {
  show             : false,
  disabledSave     : false
};

export default FeatureAutomationRowInlineToolbar;
