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
    const { axapis } = this.props;
    this.state = this.parseAxapiToState(axapis);
  }

  componentWillReceiveProps(nextProps) {
    const { axapis } = nextProps;
    this.setState(this.parseAxapiToState(axapis));
  }

  parseAxapiToState(axapis) {
    axapis = axapis || [];
    let urlsMap = {
      POST: [],
      GET: [],
      PUT: [],
      DELETE: [],
    };
    axapis.map((axapi) => {
        const [ method, url ] = axapi.split(' ');
        return { method, url };
      })
      .forEach(({method, url}) => {
        urlsMap[method].push(url);
      });
    const { POST, GET, PUT, DELETE  } = urlsMap;
    return  {
      editingPostUrls: POST.toString(),
      editingGetUrls: GET.toString(),
      editingPutUrls: PUT.toString(),
      editingDeleteUrls: DELETE.toString()
    };
  }

  onSubmit() {
    const {
      id,
      onSubmit,
      onRequestClose
    } = this.props;
    const {
      editingPostUrls,
      editingGetUrls,
      editingPutUrls,
      editingDeleteUrls
    } = this.state;

    const axapis = [
        { method: 'POST', urls: editingPostUrls },
        { method: 'GET', urls: editingGetUrls },
        { method: 'PUT', urls: editingPutUrls },
        { method: 'DELETE', urls: editingDeleteUrls }
      ]
      .filter(({urls}) => urls.trim() !== '')
      .map(({method, urls}) => urls.trim().split(',').map(url => `${method} ${url}`))
      .reduce((prev, current) => prev.concat(current), []);

    onSubmit(id, axapis);
    onRequestClose();
  }

  onCancel() {
    this.props.onRequestClose();
  }

  onEditingPostUrlsChange(value) {
    this.setState({ editingPostUrls: value.trim() });
  }

  onEditingGetUrlsChange(value) {
    this.setState({ editingGetUrls: value.trim() });
  }

  onEditingPutUrlsChange(value) {
    this.setState({ editingPutUrls: value.trim() });
  }

  onEditingDeleteUrlsChange(value) {
    this.setState({ editingDeleteUrls: value.trim() });
  }

  render() {
    const { open } = this.props;
    const {
      editingPostUrls,
      editingGetUrls,
      editingPutUrls,
      editingDeleteUrls
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
              value={editingPostUrls}
              onChange={::this.onEditingPostUrlsChange}
            />
          </div>
        </div>
        <div style={styles.wrapper}>
          <label style={styles.label}>GET</label>
          <div style={styles.select}>
            <Select
              allowCreate={true}
              multi={true}
              value={editingGetUrls}
              onChange={::this.onEditingGetUrlsChange}
            />
          </div>
        </div>
        <div style={styles.wrapper}>
          <label style={styles.label}>PUT</label>
          <div style={styles.select}>
            <Select
              allowCreate={true}
              multi={true}
              value={editingPutUrls}
              onChange={::this.onEditingPutUrlsChange}
            />
          </div>
        </div>
        <div style={styles.wrapper}>
          <label style={styles.label}>DELETE</label>
          <div style={styles.select}>
            <Select
              allowCreate={true}
              multi={true}
              value={editingDeleteUrls}
              onChange={::this.onEditingDeleteUrlsChange}
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
  axapis         : PropTypes.array,
  onRequestClose : PropTypes.func,
  onSubmit       : PropTypes.func
};


EditFeatureAutomationAxapiDialog.defaultProps = {
  open           : false,
  axapis         : []
};

export default EditFeatureAutomationAxapiDialog;
