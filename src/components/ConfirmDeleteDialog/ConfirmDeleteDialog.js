// Libraries
import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';

// Styles
import './_ConfirmDeleteDialog.css';

class ConfirmDeleteDialog extends Component {


  onConfirm() {
    const {
      onConfirm,
      onRequestClose,
      data
    } = this.props;
    onConfirm(data);
    onRequestClose();

  }

  onCancel() {
    const {
      onCancel,
      onRequestClose,
      data
    } = this.props;
    onCancel(data);
    onRequestClose();
  }

  render() {
    const {
      title,
      submitText,
      open,
      children,
      onRequestClose
    } = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={::this.onCancel}
      />,
      <FlatButton
        label={submitText}
        primary={true}
        keyboardFocused={true}
        onTouchTap={::this.onConfirm}
      />,
    ];

    return (
      <Dialog
        title={title}
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={onRequestClose} >
        {children}
      </Dialog>
    );
  }
}


ConfirmDeleteDialog.propTypes = {
  title           : PropTypes.string,
  open            : PropTypes.bool,
  data            : PropTypes.object,
  submitText      : PropTypes.string,
  onRequestClose  : PropTypes.func.isRequired,
  onConfirm       : PropTypes.func.isRequired,
  onCancel        : PropTypes.func.isRequired
};


ConfirmDeleteDialog.defaultProps = {
  title      : 'Delete',
  children   : 'Do you want to delete this ?',
  submitText : 'Delete'
};

export default ConfirmDeleteDialog;
