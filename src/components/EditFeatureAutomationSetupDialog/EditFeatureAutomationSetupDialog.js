// Libraries
import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import AutoComplete from 'material-ui/lib/auto-complete';
import TextField from 'material-ui/lib/text-field';
// Styles
import './_EditFeatureAutomationSetupDialog.css';


class EditFeatureAutomationSetupDialog extends Component {

  constructor(props) {
    super(props);
    const { axapis, path } = this.props;
    this.state = Object.assign({addToAllUrl: '', editingPath: path}, this.parseAxapiToState(axapis));
  }

  componentWillReceiveProps(nextProps) {
    const { axapis, path} = nextProps;
    this.setState(Object.assign({editingPath: path}, this.parseAxapiToState(axapis)));
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
      editingPath,
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


    const firstSlash = editingPath[0] === '/' ? '' : '/' ;
    const lastSlash = editingPath.trim().slice(-1) === '/' ? '' : '/';
    const finalEditingPath = editingPath.trim().length !== 0  ? `${firstSlash}${editingPath.trim()}${lastSlash}` : '';

    onSubmit(id, axapis, finalEditingPath);
    onRequestClose();
  }

  onCancel() {
    this.props.onRequestClose();
  }

  onPathChange(event) {
    this.setState({ editingPath: event.target.value});
  }

  onPathKeyDown(event) {
     const { keyCode } = event;

     if (keyCode === 27) {
       // esc
       this.onPathCancel();
       return;
     }
   }

  onAddToAllUrlKeyDown(event) {
    if (event.which === 13) {
      event.stopPropagation();
      this.onAddToAllUrlDone();
    } else if (event.which === 27) {
      event.stopPropagation();
      this.setState({addToAllUrl: ''});
    }
  }

  onAddToAllUrlChange(addToAllUrl) {
    this.setState({ addToAllUrl });
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

  getFilteredTestReportAxapiSuggestion() {
    const { testReportAxapiSuggestions } = this.props;
    const { addToAllUrl } = this.state;
    return testReportAxapiSuggestions
      .filter((item)=>item.includes(addToAllUrl))
      .slice(0, 8);
  }

  render() {
    const {
      open,
      testReportAxapiSuggestions
    } = this.props;
    const {
      editingPath,
      addToAllUrl,
      editingPostUrls,
      editingGetUrls,
      editingPutUrls,
      editingDeleteUrls,
    } = this.state;
    const testReportAxapiSuggestionOptions = testReportAxapiSuggestions.map(item=>({value: item, label: item}));

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
        marginLeft: 10,
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
        actions={actions}
        open={open}
        bodyStyle={{overflowY: 'auto'}}
      >
        <label>Page URL</label>
        <div style={styles.wrapper}>
          <TextField
            value={editingPath}
            placeholder="Page URL"
            onChange={::this.onPathChange}
            onKeyDown={::this.onPathKeyDown}
          />
        </div>
        <br />
        <label>AXAPI</label>
        <div style={styles.wrapper}>
          <AutoComplete
            fullWidth={true}
            hintText="Add url to all method"
            searchText={addToAllUrl}
            dataSource={::this.getFilteredTestReportAxapiSuggestion()}
            onUpdateInput={::this.onAddToAllUrlChange}
            onNewRequest={::this.onAddToAllUrlChange}
            onKeyDown={::this.onAddToAllUrlKeyDown}/>
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
              options={testReportAxapiSuggestionOptions}
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
              options={testReportAxapiSuggestionOptions}
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
              options={testReportAxapiSuggestionOptions}
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
              options={testReportAxapiSuggestionOptions}
              onChange={::this.onEditingDeleteUrlsChange}
            />
          </div>
        </div>
      </Dialog>
    );
  }
}


EditFeatureAutomationSetupDialog.propTypes = {
  id                         : PropTypes.string,
  open                       : PropTypes.bool,
  path                       : PropTypes.string,
  axapis                     : PropTypes.array,
  onRequestClose             : PropTypes.func,
  onSubmit                   : PropTypes.func,
  testReportAxapiSuggestions : PropTypes.array
};


EditFeatureAutomationSetupDialog.defaultProps = {
  open                       : false,
  testReportAxapiSuggestions : [],
  axapis                     : [],
  path                       : ''
};

export default EditFeatureAutomationSetupDialog;
