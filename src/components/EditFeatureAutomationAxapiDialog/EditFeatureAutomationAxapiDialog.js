// Libraries
import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import Select from 'react-select';

// Styles
import './_EditFeatureAutomationAxapiDialog.css';

class EditFeatureAutomationAxapiDialog extends Component {

  constructor(props) {
    super(props);
    const {
      postAxapis,
      getAxapis,
      putAxapis,
      deleteAxapis,
    } = this.props;
    this.state = {
      editingPostAxapis: postAxapis,
      editingGetAxapis: getAxapis,
      editingPutAxapis: putAxapis,
      editingDeleteAxapis: deleteAxapis
    };
  }

  onSubmit() {
    const {
      id,
      onSubmit
    } = this.props;
    const {
      editingPostAxapis,
      editingGetAxapis,
      editingPutAxapis,
      editingDeleteAxapis
    } = this.state;
    onSubmit({
      id,
      postAxapis: editingPostAxapis,
      getAxapis: editingGetAxapis,
      putAxapis: editingPutAxapis,
      deleteAxapis: editingDeleteAxapis
    });
  }

  onCancel() {
    this.props.onRequestClose();
  }

  onEditingPostAxapisChange(value) {
    this.setState({ editingPostAxapis: value });
  }

  onEditingGetAxapisChange(value) {
    this.setState({ editingGetAxapis: value });
  }

  onEditingPutAxapisChange(value) {
    this.setState({ editingPutAxapis: value });
  }

  onEditingDeleteAxapisChange(value) {
    this.setState({ editingDeleteAxapis: value });
  }

  render() {
    const { open } = this.props;
    const {
      editingPostAxapis,
      editingGetAxapis,
      editingPutAxapis,
      editingDeleteAxapis
    } = this.state;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={::this.onCancel}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={::this.onSubmit}
      />,
    ];

    const styles = {
      wrapper: {
        display: 'flex'
      },
      label: {
        width: 100
      },
      select: {
        flex: 1
      }
    };

    return (
      <Dialog
        title="Dialog With Actions"
        actions={actions}
        open={open}
      >
        <div style={styles.wrapper}>
          <label style={styles.label}>POST</label>
          <div style={styles.select}>
            <Select
              allowCreate={true}
              multi={true}
              value={editingPostAxapis}
              onChange={::this.onEditingPostAxapisChange}
            />
          </div>
        </div>
        <div style={styles.wrapper}>
          <label style={styles.label}>GET</label>
          <div style={styles.select}>
            <Select
              allowCreate={true}
              multi={true}
              value={editingGetAxapis}
              onChange={::this.onEditingGetAxapisChange}
            />
          </div>
        </div>
        <div style={styles.wrapper}>
          <label style={styles.label}>PUT</label>
          <div style={styles.select}>
            <Select
              allowCreate={true}
              multi={true}
              value={editingPutAxapis}
              onChange={::this.onEditingPutAxapisChange}
            />
          </div>
        </div>
        <div style={styles.wrapper}>
          <label style={styles.label}>DELETE</label>
          <div style={styles.select}>
            <Select
              allowCreate={true}
              multi={true}
              value={editingDeleteAxapis}
              onChange={::this.onEditingDeleteAxapisChange}
            />
          </div>
        </div>
      </Dialog>
    );
  }
}


EditFeatureAutomationAxapiDialog.propTypes = {
  id             : PropTypes.string,
  open           : PropTypes.bool,
  postAxapis     : PropTypes.array,
  getAxapis      : PropTypes.array,
  putAxapis      : PropTypes.array,
  deleteAxapis   : PropTypes.array,
  onRequestClose : PropTypes.func,
  onSubmit       : PropTypes.func
};


EditFeatureAutomationAxapiDialog.defaultProps = {
  open           : false,
  postAxapis     : [],
  getAxapis      : [],
  putAxapis      : [],
  deleteAxapis   : [],
};

export default EditFeatureAutomationAxapiDialog;
