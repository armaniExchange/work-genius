import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import moment from 'moment';

import TextField from 'material-ui/lib/text-field';
import DatePicker from '../../components/A10-UI/Input/Date-Picker.js';
import RaisedButton from 'material-ui/lib/raised-button';
import DropDownList from '../../components/A10-UI/Input/Drop-Down-List.js';

class ReleaseForm extends Component{

  static propTypes = {
    addRelease: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      date: '2016-07-01',
      priority: 'Middle',
      priorityList: ['High', 'Middle', 'Low']
    };
  }

  componentWillReceiveProps(nextProps) {
    const { release } = nextProps;
    if (release.name) {
      this.setState({
        name: release.name,
        date: moment(release.date).format('YYYY-MM-DD'),
        priority: release.priority
      });
    }
  }

  componentDidUpdate() {
    var date = this.state.date;
    const { dateField } = this.refs;
    const dateDom = ReactDOM.findDOMNode(dateField);
    dateDom.getElementsByTagName('input')[0].value = date;
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps.
  // }

  selectPriority(priority) {
    this.setState({priority: priority});
  }

  changeDate(date) {
    this.setState({date: date});
  }

  changeInput(event) {
    let value = event.target.value;
    this.setState({name: value});
  }

  submit() {
    let name = this.state.name;
    let date = this.state.date;
    let priority = this.state.priority;

    const { addRelease } = this.props;
    const option = {
      name: name,
      date: parseInt(moment(date).format('x')),
      priority: priority
    };
    addRelease(option);
  }

  render() {
    return (
      <form className="form-inline">
        <div className="col-md-3">
          <label htmlFor="releaseName">Release</label>
          <div className="inline-div">
            <TextField onChange={::this.changeInput} value={this.state.name}/></div>
        </div>
        <div className="col-md-4">
          <label htmlFor="releaseDate">Release Date</label>
          <input
          className="hidden"
          ref="releaseDate" />
          <div className="inline-div">
            <DatePicker
              defaultDate={this.state.date}
              ref="dateField"
              className="option-layout"
              onChange={::this.changeDate} />
          </div>
        </div>
        <div className="col-md-3">
          <label htmlFor="priority" style={{ 'lineHeight': '50px' }}>GUI Priority</label>
          <div style={{width: '70px', float: 'right'}}>
            <DropDownList
                title={this.state.priority}
                isDropDownListVisual2={true}
                onOptionClick={::this.selectPriority}
                aryOptionConfig={this.state.priorityList.map((text) => {
                  return {title: text, value: text};
                })} />
          </div>
        </div>
        <div className="col-md-2">
          <RaisedButton className="pull-right" label={ 'Save' }
            disabled={this.state.name === ''
                   || this.state.date === ''
                   || this.state.priority === ''}
            onClick={::this.submit} secondary={true}/>
        </div>
      </form>
    );
  }
}
export default ReleaseForm;