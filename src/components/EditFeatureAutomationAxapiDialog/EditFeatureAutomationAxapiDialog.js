// Libraries
import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
// Styles
import './_EditFeatureAutomationAxapiDialog.css';

class EditFeatureAutomationAxapiDialog extends Component {

  constructor(props) {
    super(props);
    const { axapis } = this.props;
    this.state = Object.assign({addToAllUrl: ''}, this.parseAxapiToState(axapis));
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
      editingDeleteUrls: DELETE.toString(),
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

  onAddToAllUrlKeyUp(event) {
    if (event.which === 13) {
      event.stopPropagation();
      this.onAddToAllUrlDone();
    } else if (event.which === 27) {
      event.stopPropagation();
      this.setState({addToAllUrl: ''});
    }
  }

  onAddToAllUrlChange(event) {
    this.setState({ addToAllUrl: event.target.value });
  }

  onAddToAllUrlDone() {
    const {
      addToAllUrl,
      editingPostUrls,
      editingGetUrls,
      editingPutUrls,
      editingDeleteUrls
    } = this.state;
    this.setState({
      addToAllUrl: '',
      editingPostUrls: editingPostUrls.split(',').filter(item=>item).concat(addToAllUrl).toString(),
      editingGetUrls: editingGetUrls.split(',').filter(item=>item).concat(addToAllUrl).toString(),
      editingPutUrls: editingPutUrls.split(',').filter(item=>item).concat(addToAllUrl).toString(),
      editingDeleteUrls: editingDeleteUrls.split(',').filter(item=>item).concat(addToAllUrl).toString(),
    });
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
      addToAllUrl,
      editingPostUrls,
      editingGetUrls,
      editingPutUrls,
      editingDeleteUrls
    } = this.state;
    const actions = [
      <FlatButton
        label="Cancel"
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
        display: 'flex',
        marginBottom: 10
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
        bodyStyle={{overflowY: 'auto'}}
      >
        <div style={styles.wrapper}>
          <TextField
            style={{width: '100%'}}
            hintText="Add url to all method"
            value={addToAllUrl}
            onChange={::this.onAddToAllUrlChange}
            onKeyUp={::this.onAddToAllUrlKeyUp}/>
          <FlatButton
            secondary={true}
            label="Add"
            onClick={::this.onAddToAllUrlDone}
            disabled={!addToAllUrl} />
        </div>
        <br />
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
