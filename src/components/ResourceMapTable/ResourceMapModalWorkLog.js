import './_color.css';
import React, { Component, PropTypes } from 'react';
import moment from 'moment';

// Components
import {
  Modal
} from 'react-bootstrap';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
// import DatePicker from '../../components/A10-UI/Input/Date-Picker.js';
import { DateField } from 'react-date-picker';
import 'react-date-picker/index.css';
// import TimePicker from 'material-ui/lib/time-picker/time-picker';
import Tooltip from 'rc-tooltip';

import Select from 'react-select';

let ModalHeader = ({isEdit}) => {
  return (
    <Modal.Header closeButton>
    <Modal.Title>{isEdit ? 'Edit Task' : 'Add Task'}</Modal.Title>
    </Modal.Header>
  );
};

let ModalFooter = ({isEdit, onSubmit, onCancelHandler}) => {
  return (
    <Modal.Footer>
    <RaisedButton label={ isEdit ? 'Update' : 'Apply' } secondary={true} onClick={onSubmit} />
    <RaisedButton label="Cancel" onClick={onCancelHandler} />
    </Modal.Footer>
  );
};

let initialState = {
  color: '',
  selectStartDate: '',
  selectEndDate: '',
  release: '',
  tags: '',
  title: '',
  //the properties for valiation
  isTitleEmpty: false,
  isDurationEmpty: false,
  isEndLessThanStart: false,
  onFocusRelease: false
};

class ResourceMapModalWorkLog extends Component {
  constructor() {
    super();
    // Close modal handle
    this._onCloseModelHandler = ::this._onCloseModelHandler;
    // Submit form data
    this._onSubmitFormData = ::this._onSubmitFormData;
    // Select tag color
    this._onSelectTagColor = ::this._onSelectTagColor;
    // Submit single item
    this._onSubmitSingleItem = ::this._onSubmitSingleItem;
    // Submit multi items
    this._onSubmitMultiItems = ::this._onSubmitMultiItems;
    // Select Release Change.
    this._handleSelectReleaseChange = ::this._handleSelectReleaseChange;
    // Select Tag
    this._onSelectTag = ::this._onSelectTag;
    // Change start date
    this._changeStartDate = ::this._changeStartDate;
    // Change end date
    this._changeEndDate = ::this._changeEndDate;
    // Change task title
    this._handleSelectTitleChange = ::this._handleSelectTitleChange;

    this.state = initialState;
  }

  componentWillReceiveProps (nextProps) {
    const { show, defaultModalInfos } = nextProps;
    defaultModalInfos.tags = defaultModalInfos.tags ? defaultModalInfos.tags : [];
    if (show) {
      let tag = this.state.tags !== '' ? this.state.tags : defaultModalInfos.tags.join(',');
      let release = this.state.release !== '' ? this.state.release : defaultModalInfos.release;
      let title = this.state.title !== '' ? this.state.title : defaultModalInfos.title;
      this.setState({
        release: release,
        progress: defaultModalInfos.progress,
        color: defaultModalInfos.color,
        tags: tag,
        title: title
      });
    } else {
      this.setState({
        release: '',
        progress: 0,
        color: '',
        tags: '',
        title: '',
        isTitleEmpty: false,
        isDurationEmpty: false,
        isEndLessThanStart: false,
        selectEndDate: ''
      });
    }
    this.setState({onFocusRelease: false});
  }

  //validate the input
  //when create/edit task, title,duration,start date and end date can't be empty.
  _validateInput(data) {
    const {
      start_date,
      end_date,
      title,
      duration
    } = data;
    let newErrorState = {
      isTitleEmpty: false,
      isDurationEmpty: false,
      isEndLessThanStart: false
    },
    isInputValid = true;

    if (!title) {
      newErrorState.isTitleEmpty = true;
      isInputValid = false;
    }
    if (end_date <= start_date) {
      newErrorState.isEndLessThanStart = true;
      isInputValid = false;
    }
    if (!duration) {
      newErrorState.isDurationEmpty = true;
      isInputValid = false;
    }
    this.setState(newErrorState);
    return isInputValid;
  }

  _onCloseModelHandler() {
    const { onModalHander } = this.props;
    onModalHander(false, {});
  }

  /**
  * Submit form data.
  */
  _onSubmitFormData() {
    const { defaultModalInfos, onModalSubmit } = this.props;
    const { workLogField, progressField, durationField } = this.refs;
    let workValue = '';
    let progressValue = 0;
    let taskValue = this.state.title;
    if (defaultModalInfos.id !== undefined) {
      workValue = workLogField.getValue();
      progressValue = progressField.getValue();
      progressValue = parseInt(progressValue) > 100 ? 100 : parseInt(progressValue);
      progressValue = parseInt(progressValue) < 0 ? 0 : parseInt(progressValue);
    }

    let startDate, endDate;
    if (this.state.selectStartDate) {
      startDate = moment(this.state.selectStartDate).format('x');
    } else {
      startDate = defaultModalInfos.id
          ? defaultModalInfos.start_date
          : moment(defaultModalInfos.date).hour(9).format('x');
    }

    if (this.state.selectEndDate) {
      endDate = moment(this.state.selectEndDate).format('x');
    } else {
      endDate = defaultModalInfos.id
          ? defaultModalInfos.end_date
          : moment(defaultModalInfos.date).hour(18).format('x');
    }

    let status = defaultModalInfos.status ? defaultModalInfos.status : 0;
    // If progress is 100%, the status is 1;
    status = parseInt(progressValue) >= 100 ? 1 : 0;
    let color = (this.state.color === undefined || this.state.color === '')
               ? this._$defaultColor() : this.state.color;
    let data = {
      'employee_id': defaultModalInfos.userId,
      'id': defaultModalInfos.id,
      'title': taskValue,
      'content': workValue,
      'progress': parseInt(progressValue),
      'color': color,
      'start_date': parseInt(startDate),
      'end_date': parseInt(endDate),
      'duration': parseInt(durationField.getValue()),
      'release': this.state.release,
      'status': status,
      'tags': this.state.tags.split(',')
    };
    let item = {
      id: defaultModalInfos.id,
      employee_id: defaultModalInfos.userId,
      data: data
    };
    let isValidInput = this._validateInput(data);
    if (isValidInput){
      onModalSubmit(item);
      this._onCloseModelHandler();
    }
    // this._$PrintFormData(this);
  }

  _$defaultColor() {
    let list = [ 'bgm-teal', 'bgm-red', 'bgm-pink', 'bgm-blue', 'bgm-lime',
    'bgm-green', 'bgm-cyan', 'bgm-orange', 'bgm-purple'];

    var Rand = Math.random();
    let num = Math.round(Rand * 9);
    return list[num];
  }

  /**
  * Use console.log() to print form data on Browser Console.
  * This is private function.
  */
  _$PrintFormData(self){
    const { defaultModalInfos } = self.props;
    const { workLogField, progressField, durationField } = self.refs;
    // console.log('Task Value: ' + taskField.getValue());
    if (defaultModalInfos.id !== undefined){
      console.log('Work Log Value: ' + workLogField.getValue());
      console.log('Progress Value: ' + progressField.getValue());
    }

    console.log(defaultModalInfos);

    // let startDate = self.state.selectDate ? self.state.selectDate : defaultModalInfos.date;
    // startDate instanceof moment ? console.log(startDate.format('YYYY-MM-DD')) : console.log(startDate);
    let startDate, endDate;
    if (defaultModalInfos.id) {
      startDate = self.state.selectStartDate ? moment(self.state.selectStartDate).format('x') : defaultModalInfos.start_date;
      endDate = self.state.selectEndDate ? moment(self.state.selectEndDate).format('x') : defaultModalInfos.end_date;
    } else {
      startDate = moment(defaultModalInfos.date).hour(9).format('x');
      let startDate1 = moment(defaultModalInfos.date).hour(9).format('YYYY-MM-DD HH:mm:ss');
      endDate = moment(defaultModalInfos.date).hour(18).format('x');
      let endDate1 = moment(defaultModalInfos.date).hour(18).format('YYYY-MM-DD HH:mm:ss');
      console.log(startDate1, endDate1);
    }

    console.log('Start Date: ' + startDate);
    console.log('End Date: ' + endDate);

    console.log('Title: ' + this.state.title);
    console.log('Tag Color Value: ' + self.state.color);
    console.log('Duration Value: ' + durationField.getValue());
    console.log('Release: ' + self.state.release);
    console.log('Tags: ' + self.state.tags);
  }

  _onSubmitSingleItem() {
    const { workLogField, progressField } = this.refs;
    const { defaultModalInfos, onModalSubmit } = this.props;

    let worklogValue = workLogField.getValue();
    let progressValue = progressField.getValue();
    if (worklogValue !== undefined && worklogValue !== '') {
      let color = this.state.color;
      let date = defaultModalInfos.date.format('YYYY-MM-DD');
      let newItem = this._createNewItem(defaultModalInfos, date, color, worklogValue, progressValue);

      onModalSubmit(newItem);
    }
  }

  _onSubmitMultiItems() {
    const { startDate, endDate, workLogField, progressField } = this.refs;
    let worklogValue = workLogField.getValue();
    let progressValue = progressField.getValue();
    if (worklogValue === undefined || worklogValue === '') {
      return;
    }
    const { defaultModalInfos, onModalSubmitMulti} = this.props;
    let startMoment = moment(startDate.value);
    let endMoment = moment(endDate.value);
    if (parseInt(startMoment.format('X')) >= parseInt(endMoment.format('X'))) {
      this._onSubmitSingleItem();
    } else {
      let dates = this._dateList(startMoment, endMoment);
      var color = this.state.color;
      let items = dates.map((date) => {
        let newItem = this._createNewItem(defaultModalInfos, date, color, worklogValue, progressValue);
        return newItem;
      });
      onModalSubmitMulti(items);
    }
  }

  _createNewItem(defaultModalInfos, date, color, worklogValue, progressValue) {
    progressValue = progressValue > 100 ? 100 : progressValue;
    let newItem = {
      color: color,
      content: worklogValue,
      progress: progressValue,
      id: defaultModalInfos.id,
      employee_id: defaultModalInfos.userId,
      date: date,
      status: defaultModalInfos.status ? defaultModalInfos.status : 0
    };
    return newItem;
  }

  _dateList(startMoment, endMoment) {
    let duration = moment.duration({'days' : 1});
    let dateList = [];
    for (let i = 0; parseInt(startMoment.format('X')) <= parseInt(endMoment.format('X')); i ++) {
      dateList.push(startMoment.format('YYYY-MM-DD'));
      startMoment.add(duration);
    }
    return dateList;
  }

  _handleSelectReleaseChange(value) {
    const { releases, onAddReleaseHandler } = this.props;
    this.setState({release: value});

    let release = releases.find((option) => {
      return option.tag_name === value;
    });

    if (!release) {
      onAddReleaseHandler(value);
    }
  }

  releaseSelectFocus(){
    this.setState({onFocusRelease: true});
  }

  releaseSelectBlur(){
    this.setState({onFocusRelease: false});
  }

  // When select a new tag color, change the state tag value.
  _onSelectTagColor(e) {
    let color = e.target.getAttribute('data-tag');
    this.setState({color: color});
  }

  _onSelectTag(type) {
    this.setState({tags: type});
    let types = type.split(',');
    const { tags, onAddTagHandler } = this.props;
    for (let newType of types) {
      let tag = tags.find((inTag) => {
        return inTag.tag_name === newType;
      });
      if (newType !== undefined && tag === undefined) {
        onAddTagHandler(newType);
      }
    }
  }

  _changeStartDate(date) {
    this.setState({'selectStartDate': date});
  }

  _changeEndDate(date) {
    this.setState({'selectEndDate': date});
  }

  _handleSelectTitleChange(title) {
    this.setState({title: title});
  }

  _handleSelectTitleBlur() {
    const { titleRef } = this.refs;
    let title = titleRef._optionsFilterString === ''
              ? titleRef.state.value : titleRef._optionsFilterString;
    this.setState({ title: title });
    this.setState({onFocusRelease: false});
  }

  // _changeStartTime(e, date) {
  //   let time = moment(date);
  //   let hour = time.hour(),
  //     minute = time.minute(),
  //     second = time.second();
  //   let times = ((( hour * 60  + minute ) * 60 ) + second ) * 1000;
  //   this.setState({selectTime: times});
  // }

  // _changeEndTime(e, date) {
  //   let time = moment(date);
  //   let hour = time.hour(),
  //     minute = time.minute(),
  //     second = time.second();
  //   let times = ((( hour * 60  + minute ) * 60 ) + second ) * 1000;
  //   this.setState({endTime: times});
  // }

  render() {
    const {
      show,
      tags,
      titles,
      releases,
      defaultModalInfos
    } = this.props;
    const {
      isTitleEmpty,
      isDurationEmpty,
      isEndLessThanStart
    } = this.state;
    defaultModalInfos.progress = defaultModalInfos.progress ? defaultModalInfos.progress : 0;
    let showDoneClassName = 'material-icons icon-layout';
    let hideDoneClassName = 'material-icons icon-layout icon-layou-display';
    let nowDate, defaultEndDate;
    if (defaultModalInfos.id) {
      nowDate = moment(defaultModalInfos.start_date).format('YYYY-MM-DD HH:mm:ss');
      defaultEndDate = moment(defaultModalInfos.end_date).format('YYYY-MM-DD HH:mm:ss');
    } else {
      nowDate = moment(defaultModalInfos.date).hour(9).format('YYYY-MM-DD HH:mm:ss');
      defaultEndDate = moment(defaultModalInfos.date).hour(18).format('YYYY-MM-DD HH:mm:ss');
    }
    // let releaseOptions = ['4.1.0', '4.1.1', '3.2.1'];
    var isShowWorkLog = defaultModalInfos.id !== undefined;
    var colorHtml = (
      <div className="form-group">
        <label className="col-xs-3 control-label">Color</label>
        <div className="col-xs-9">
          <div className="event-tag">
            <Tooltip placement="top" overlay={'Level 1: Doing Now'}
                arrowContent={<div className="rc-tooltip-arrow-inner"></div>} >
              <span onClick={this._onSelectTagColor} data-tag="bgm-red"    className="bgm-red">
                <i className={this.state.color === 'bgm-red' ? showDoneClassName : hideDoneClassName}>done</i>
              </span>
            </Tooltip>
            <Tooltip placement="top" overlay={'Level 2'}
                arrowContent={<div className="rc-tooltip-arrow-inner"></div>} >
              <span onClick={this._onSelectTagColor} data-tag="bgm-lime"   className="bgm-lime">
                <i className={this.state.color === 'bgm-lime' ? showDoneClassName : hideDoneClassName}>done</i>
              </span>
            </Tooltip>
            <Tooltip placement="top" overlay={'Level 3: Doing once free'}
                arrowContent={<div className="rc-tooltip-arrow-inner"></div>} >
              <span onClick={this._onSelectTagColor} data-tag="bgm-teal"   className="bgm-teal">
                <i className={this.state.color === 'bgm-teal' ? showDoneClassName : hideDoneClassName}>done</i>
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
    );
    var className = isShowWorkLog ? 'mdl-cell mdl-cell--6-col' : 'mdl-cell mdl-cell--12-col';
    var taskHtml = (
      <div className={className}>
        <div className="form-group">
          <label className="col-xs-3 control-label">Task</label>
          <div className="col-xs-9">
            <Select
                allowCreate={true}
                name="menu_tag"
                value={this.state.title}
                options={titles.map((option) => {
                  return {label: option, value: option};
                })}
                ref="titleRef"
                onChange={this._handleSelectTitleChange}
                onFocus={::this.releaseSelectFocus}
                onBlur={::this._handleSelectTitleBlur} />
          </div>
        </div>
        <div className={isTitleEmpty ? 'col-xs-3 error' : 'col-xs-3 hide'}>
        </div>
        <div className={isTitleEmpty ? 'col-xs-9 error left-align' : 'col-xs-9 hide'}>
          Task  must not be empty!
        </div>
        <div className="form-group">
          <label className="col-xs-3 control-label">Release</label>
          <div className="col-xs-9">
            <Select
                allowCreate={true}
                name="menu_tag"
                value={this.state.release}
                options={releases.map((option) => {
                return {label: option.tag_name, value: option.tag_name};
                })}
                onChange={this._handleSelectReleaseChange}
                onFocus={::this.releaseSelectFocus}
                onBlur={::this.releaseSelectBlur} />
          </div>
        </div>
        <div className="form-group">
          <label className="col-xs-3 control-label">Start Time</label>
          <div className="col-xs-9">
            <input
            className="hidden"
            defaultValue={nowDate}
            ref="startDate" />
            <div className="col-xs-12 datepicker-style layout-design-padding-left-0 layout-design-padding-right-0" >
              <DateField
                  style={{width: '100%'}}
                  forceValidDate
                  defaultValue={nowDate}
                  onChange={this._changeStartDate}
                  dateFormat="YYYY-MM-DD HH:mm:ss" />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="col-xs-3 control-label">End Time</label>
          <div className="col-xs-9">
            <div className="col-xs-12 datepicker-style layout-design-padding-left-0 layout-design-padding-right-0" >
              <DateField
                  style={{width: '100%'}}
                  forceValidDate
                  defaultValue={defaultEndDate}
                  onChange={this._changeEndDate}
                  dateFormat="YYYY-MM-DD HH:mm:ss" />
            </div>
          </div>
        </div>
        <div className={isEndLessThanStart ? 'col-xs-3 error' : 'col-xs-3 hide'}>
        </div>
        <div className={isEndLessThanStart ? 'col-xs-9 error left-align' : 'col-xs-9 hide'}>
          End time must not be earlier than Start time!
        </div>
        <div className="form-group">
          <label className="col-xs-3 control-label">Duration</label>
          <div className="col-xs-9">
            <TextField
              type="number"
              min="0"
              max="100"
              className="text-area-duration-style"
              defaultValue={defaultModalInfos.duration}
              ref="durationField" />
            <span>hours</span>
          </div>
        </div>
        <div className={isDurationEmpty ? 'col-xs-3 error' : 'col-xs-3 hide'}>
        </div>
        <div className={isDurationEmpty ? 'col-xs-9 error left-align' : 'col-xs-9 hide'}>
          Duration must not be empty!
        </div>

        {colorHtml}
      </div>
    );

    var workHtml = isShowWorkLog ? (
      <div className={className}>
        <div className="form-group">
          <label className="col-xs-3 control-label">Work Log</label>
          <div className="col-xs-9">
            <TextField
                className="text-area-style"
                multiLine={true}
                rowsMax={15}
                defaultValue={defaultModalInfos.content}
                rows={7}
                ref="workLogField" />
          </div>
        </div>
        <div className="form-group">
          <label className="col-xs-3 control-label">Tag</label>
          <div className="col-xs-9">
            <Select
                multi={true}
                allowCreate={true}
                name="menu_tag"
                value={this.state.tags}
                options={tags.map((tag) => {
                return {label: tag.tag_name, value: tag.tag_name};
                })}
                onChange={this._onSelectTag} />
          </div>
        </div>
        <div className="form-group">
          <label className="col-xs-3 control-label">Progress</label>
          <div className="col-xs-9">
            <TextField
                className="text-area-progress-style"
                type="number"
                min="0"
                max="100"
                defaultValue={defaultModalInfos.progress}
                ref="progressField" />
            <span>%</span>
          </div>
        </div>
      </div>
      ) : (<div />);

    let defaultProps = {};
    if (isShowWorkLog) {
      defaultProps.bsSize = 'large';
    }

    return (
      <Modal
          show={ show }
          onHide={ this._onCloseModelHandler }
          {...defaultProps} >
        <ModalHeader isEdit={defaultModalInfos.id !== undefined} />
        <Modal.Body>
          <form className="form-horizontal mdl-grid">
            {taskHtml}
            {workHtml}
          </form>
        </Modal.Body>
        <ModalFooter
            isEdit={defaultModalInfos.id !== undefined}
            onSubmit={this._onSubmitFormData}
            onCancelHandler={this._onCloseModelHandler} />
      </Modal>
      );
  }
}

ResourceMapModalWorkLog.propTypes = {
  show               : PropTypes.bool.isRequired,
  tags               : PropTypes.array.isRequired,
  titles             : PropTypes.array.isRequired,
  releases           : PropTypes.array.isRequired,
  defaultModalInfos  : PropTypes.object.isRequired,
  onModalSubmit      : PropTypes.func.isRequired,
  onModalHander      : PropTypes.func.isRequired,
  onModalSubmitMulti : PropTypes.func.isRequired,
  onAddTagHandler    : PropTypes.func.isRequired,
  onAddReleaseHandler: PropTypes.func.isRequired
};

ResourceMapModalWorkLog.defaultProps = {
  show                   : false,
  defaultModalInfos      : {},
  onModalSubmit          : () => {},
  onCancelHandler        : () => {},
  onModalSubmitMulti     : () => {}
};

export default ResourceMapModalWorkLog;
