import React, { Component, PropTypes } from 'react';
import ReactDOMServer from 'react-dom/server';
import { connect } from 'react-redux';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { Row, Col, Input, TreeSelect, Icon, Checkbox } from 'antd';
import RaisedButton from 'material-ui/lib/raised-button';
import { DateField } from 'react-date-picker';
// import CircularProgress from 'material-ui/lib/circular-progress';

import * as BugReviewActions from '../../actions/bug-review-actions';
import * as BugWeeklyReportActions from '../../actions/bug-weekly-report-actions';
import * as appActions from '../../actions/app-actions';
import * as mainActions from '../../actions/main-actions';
import * as resourceMapActions from '../../actions/resource-map-actions';
import DropDownList from '../../components/A10-UI/Input/Drop-Down-List.js';
import HighlightMarkdown from '../../components/HighlightMarkdown/HighlightMarkdown';
import Editor from '../../components/Editor/Editor';
import Clipboard from 'clipboard';

import Breadcrumb from '../../components/A10-UI/Breadcrumb';
import BREADCRUMB from '../../constants/breadcrumb';

// import 'antd/dist/antd.css';
import './_BugWeeklyReportPage.css';
import 'antd/lib/grid/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/tree-select/style/index.css';
import 'antd/lib/select/style/index.css';
import 'antd/lib/checkbox/style/index.css';

class BugWeeklyReport extends Component {

  static propTypes = {
    applications:                         PropTypes.array,
    allUsers:                             PropTypes.array,
    currentUser:                          PropTypes.object,
    currentSelectUser:                    PropTypes.object,
    checkPoints:                          PropTypes.array,
    checkPointsObj:                       PropTypes.object,
    weeklyBugReport:                      PropTypes.object,
    fetchAllUsersRequest:                 PropTypes.func,
    fetchWeeklyReport:                    PropTypes.func,
    fetchCheckpoint:                      PropTypes.func,
    updateBugReport:                      PropTypes.func,
    updateSummary:                        PropTypes.func,
    saveBugReport:                        PropTypes.func,
    removeCheckpoint:                     PropTypes.func,
    approvalCheckpoint:                   PropTypes.func,
    queryResourceMapData:                 PropTypes.func,
    sendMail:                             PropTypes.func,
    data:                                 PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      newCheckPoint: {},
      preview: false
    };
  }

  componentWillMount() {
    const { fetchAllUsersRequest, fetchCheckpoint, currentUser, fetchWeeklyReport, queryResourceMapData } = this.props;
    const value = currentUser.email.substring(0, currentUser.email.indexOf('@'));
    const startDate = moment().weekday(0).format('YYYY-MM-DD');
    fetchAllUsersRequest();
    fetchCheckpoint();
    fetchWeeklyReport(currentUser.id, value, startDate);
    queryResourceMapData(startDate, 7, currentUser.id);
    this.setState({
      currentUser: {
        title: currentUser.name,
        value: value,
        id: currentUser.id
      },
      startDate: startDate, 
    });
  }

  componentDidMount() {
    var clipboard = new Clipboard('#copy-weekly-report');
    clipboard.on('success', function(e) {
      e.clearSelection();
    });
  }

  isAdmin(name) {
    if (name === 'Craig Huang' || name === 'Zuoping Li') {
      return true;
    }
    return false;
  }

  getUserName(email) {
    return email.substring(0, email.indexOf('@'));
  }

  getRenderCheckpointTreeData(data) {
    const result = [];
    const { removeCheckpoint, approvalCheckpoint, currentUser } = this.props;
    data.forEach((item) => {
      if (!item) {
        return;
      }

      const newItem = {
        label: item.label,
        value: item.value,
        key: item.key
      };
      if (item.children) {
        newItem.children = this.getRenderCheckpointTreeData(item.children);
      }
      if (item.createBy && !item.children) {
        const approvalBtn = !item.isApproval && this.isAdmin(currentUser.name) ? (
          <Icon type="check"
            style={{color: 'green'}}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              approvalCheckpoint(item.id);
            }} />
        ) : null;
        const deleteBtn = currentUser.id === item.createBy || this.isAdmin(currentUser.name) ? (
          <Icon type="close"
            style={{color: 'red'}}
            onClick={e => {
              e.preventDefault(); 
              e.stopPropagation();
              removeCheckpoint(item.id);
            }} />
        ) : null;
        newItem.title = (
          <Row>
            <Col span={20}>
              <span>{item.label}</span>
            </Col>
            <Col span={4} className="ctrl-icon-container">
              {approvalBtn}
              {deleteBtn}
            </Col>
          </Row>
        );
      }
      result.push(newItem);
    });
    return result;
  }

  onChangeSelectUser = user => {
    const {
      allUsers, fetchWeeklyReport, queryResourceMapData
    } = this.props;
    const { 
      startDate,
    } = this.state;
    var result = {};

    if (user === undefined || user === '') {
      result = {
        title: 'All'
      };
    } else {
      for (var i = 0; i < allUsers.length; i++) {
        if (allUsers[i].id !== user) {
          continue;
        }
        result = {
          title: allUsers[i].name,
          value: allUsers[i].alias,
          id: allUsers[i].id
        };
        break;
      }
    }

    fetchWeeklyReport(result.id, result.value, startDate);
    queryResourceMapData(startDate, 7, result.id);
    this.setState({
      currentUser: result
    });
  }

  updateBugReport = (key, options) => {
    const { updateBugReport } = this.props;
    updateBugReport(key, options);
  };

  addNewCheckPoint = (str, key) => {
    if (str.length || str === '$$_newitem: ') {
      this.setState({
        newCheckPoint: {
          ...this.state.newCheckPoint,
          [key]: str
        },
      });
      this.updateBugReport(key, { checkpoint: `$$_newitem: ${str}` });
    } else {
      delete this.state.newCheckPoint[key];
      this.setState({
        newCheckPoint: this.state.newCheckPoint
      });
      this.updateBugReport(key, { checkpoint: undefined });
    }
  }

  changeStartDate = date => {
    const { currentUser } = this.state;
    const { fetchWeeklyReport, queryResourceMapData } = this.props; 
    fetchWeeklyReport(currentUser.id, currentUser.value, date);
    queryResourceMapData(date, 7, currentUser.id);
    this.setState({
      startDate: date
    });
  };

  findCheckpointPos(checkPoints, newCheckpoint, currentIndex) {
    let result = [];
    for (let i = 0; i < checkPoints.length; i++) {
      const label = checkPoints[i].label || checkPoints[i];
      if (label === newCheckpoint[currentIndex]) {
        result.push(i);
        if (checkPoints[i].children) {
          result = result.concat(this.findCheckpointPos(checkPoints[i].children, newCheckpoint, ++currentIndex));
        }
        break;
      } else if (i === checkPoints.length - 1) {
        result.push(checkPoints.length);
      }
    }
    return result;
  }

  saveBugReport = () => {
    const { currentUser, startDate } = this.state;
    const { saveBugReport, weeklyBugReport, checkPoints } = this.props;

    for (const key in weeklyBugReport.bugs) {
      if (!weeklyBugReport.bugs.hasOwnProperty(key)) {
        continue;
      }
      
      const bug = weeklyBugReport.bugs[key];
      if (bug.checkpoint && bug.checkpoint.indexOf('$$_newitem: ') === 0) {
        const newCheckpoint = bug.checkpoint.substring(12).split('/');
        const newCheckpointKey = this.findCheckpointPos(checkPoints, newCheckpoint, 0);
        bug.checkpointKey = newCheckpointKey.join('-');
      }
    }

    this.setState({newCheckPoint: {}});
    saveBugReport(currentUser.id, currentUser.value, startDate, weeklyBugReport);
  };

  handleKeyDown = (event) => {
    if (event.ctrlKey && event.which === 83){
      console.log('ctrl s! ');
      event.preventDefault(); 
      this.saveBugReport();
      return false;
    } else {
      return true;
    }
  };

  transformStrToTreeData(str) {
    const data = str.split('/');
    const result = [];
    let tmpIndex = '';
    data.reduce((prevResult, item, index) => {
      if (tmpIndex.length) {
        tmpIndex += '-' + index;
      } else {
        tmpIndex = index+'';
      }

      prevResult[0] = {
        label: item,
        value: item,
        key: tmpIndex
      };
      if (data.length - 1 === index) {
        prevResult[0].value = `$$_newitem: ${str}`;
      } else if (index < data.length - 1) {
        const children = [];
        prevResult[0].children = children;
        return children;
      }
      return prevResult;
    }, result);

    return result;
  }

  getCopyReportStr = () => {
    const { weeklyBugReport, checkPointsObj } = this.props;
    const { startDate, currentUser } = this.state;

    let result = `# Summary\n
Owner: ${currentUser.title}\n
Due: ${startDate} to ${moment(startDate, 'YYYY-MM-DD').add(7, 'days').format('YYYY-MM-DD')}\n
Report Date: ${moment().format('YYYY-MM-DD hh:mm')}\n
--------------\n
${weeklyBugReport.summary || ''}\n\n-------\n\n`;

    result += `## Task detail${this.getWeeklyTaskContentStr()}\n\n-------\n\n`;

    if (weeklyBugReport.bugs && Object.keys(weeklyBugReport.bugs).length) {
      result += '## Bugs Analysis\n';
      for (const key in weeklyBugReport.bugs) {
        if (!weeklyBugReport.bugs.hasOwnProperty(key)) {
          continue;
        }
        const bug = weeklyBugReport.bugs[key];

        let checkpointStr = '';
        if (bug['checkpoint'] && checkPointsObj[bug['checkpoint']]) {
          checkpointStr = checkPointsObj[bug['checkpoint']].value;
        }

        result += `### ${key}:\n
- title: \n${bug['short_desc']}\n
- RCA: \n${(bug['rca'] || '--')}\n
- Check Point: \n${checkpointStr}\n
- Prevention in the feature: \n${(bug['prevent'] || '--')}\n
- Issue by me: \n${bug['isIssueByMe'] || 'No'}\n
-------\n\n`;
      }
    }

    return result;
  };

  renderWeeklyBugReport() {    
    const { newCheckPoint } = this.state;
    const { weeklyBugReport, checkPoints } = this.props;
    const checkpointTreeData = this.getRenderCheckpointTreeData(checkPoints);
    return Object.keys(weeklyBugReport.bugs).map((key) => {
      const data = weeklyBugReport.bugs[key];
      let treeData = checkpointTreeData;
      let filterTreeNode = undefined;
      if (newCheckPoint[key]) {
        treeData = this.transformStrToTreeData(newCheckPoint[key]);
        filterTreeNode = () => true;
      }

      return (
        <div className="bug-report-item" key={key}>
          <Row>
            <Col span={20}>
              <div>
                <div className="title">{data['short_desc']}</div>
                <div className="branch-description">Fixed Branches: {data['build_label']}</div>
              </div>
            </Col>
            <Col span={4} className="reviewer-container">
              Reviewer: {data.reviewer.join(', ')}
            </Col>
          </Row>
          <Row className="field">
            <Col span={3} key="label">RCA</Col>
            <Col span={21} key="content">
              <Input type="textarea" rows={4} value={data.rca} onChange={(e) => {
                this.updateBugReport(key, {
                  rca: e.target.value
                });
              }} />
            </Col>
          </Row>
          <Row className="field">
            <Col span={3} key="label">
              <span>Check Points</span>
            </Col>
            <Col span={21} key="content">
              <TreeSelect
                style={{ width: 800 }}
                value={data.checkpoint}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                placeholder="Please select"
                onChange={(value) => {
                  this.updateBugReport(key, {
                    checkpoint: value
                  });
                }}
                showSearch
                onSearch={(str) => this.addNewCheckPoint(str, key)}
                searchPlaceholder="Please enter a new check point"
                filterTreeNode={filterTreeNode}
              />
            </Col>
          </Row>
          <Row className="field">
            <Col span={3} key="label">
              <span>Prevention in the feature</span>
            </Col>
            <Col span={21} key="content">
              <Input type="textarea" rows={4} value={data.prevent} onChange={(e) => {
                this.updateBugReport(key, {
                  prevent: e.target.value
                });
              }} />
            </Col>
          </Row>
          <Row className="field">
            <Col span={3} key="label">
              <span>Issue by me</span>
            </Col>
            <Col span={21} key="content">
              <Checkbox onChange={(e) => {
                this.updateBugReport(key, {
                  isIssueByMe: e.target.checked
                });
              }}>Yes</Checkbox>
            </Col>
          </Row>
        </div>
      );
    });
  }

  previewReport = () => {
    this.setState({ preview: true });
  }

  renderContent() {
    const { weeklyBugReport, updateSummary } = this.props;

    let fixedBugSec = null;
    if (Object.keys(weeklyBugReport.bugs).length) {
      fixedBugSec = (
        <div className="weekly-report-item-container">
          <h4>Fixed bugs</h4>
          {this.renderWeeklyBugReport()}
        </div>
      );
    }
    return (
      <div onKeyDown={this.handleKeyDown}>
        {fixedBugSec}

        <div className="weekly-summary">
          <h4>Summary</h4>
          <Editor ref="editor" value={weeklyBugReport.summary} onChange={updateSummary} />
        </div>

        <RaisedButton 
          label="Save"
          style={{marginRight: 10}}
          onClick={this.saveBugReport} />
        <RaisedButton
          label="Preview"
          style={{marginRight: 10}}
          onClick={this.previewReport} />
        <RaisedButton 
          id="copy-weekly-report"
          label="Copy"
          style={{marginLeft: 10}}
          data-clipboard-text={this.getCopyReportStr()}  />
      </div>
    );
  }

  getWeeklyTaskContentStr() {
    const { data } = this.props;
    let str = '';
    data.forEach(function(item) {
      if (!item.jobs) {
        return;
      }

      item.jobs.forEach(function(day) {
        if (!day['job_items']) {
          return;
        }
        const date = moment(day.date).format('YYYY-MM-DD');
        str += `\n- ${date}:\n`;
        day['job_items'].forEach(function(job) {
          str += `${job.title}: ${job.progress}%\n`;
        });
      });
    });
    return str;
  }

  renderPreviewContent() {
    const reportStr = this.getCopyReportStr();
    const previewReport = <HighlightMarkdown source={reportStr} />;
    return (
      <div>
        {previewReport}
        <RaisedButton
          label="Edit"
          style={{marginRight: 10}}
          onClick={() => {
            this.setState({ preview: false });
          }} />
        <RaisedButton 
          label="Send"
          style={{marginLeft: 10}}
          onClick={() => {
            const { currentUser } = this.state;
            const { sendMail } = this.props;
            sendMail(
              [], 
              ['ax-web-DL@a10networks.com', `${currentUser.value}@a10networks.com`], 
              '',
              `${currentUser.title} - Weekly Report`, 
              reportStr.replace(/\n/g, ''),
              ReactDOMServer.renderToStaticMarkup(previewReport).replace(/\n/g, '').replace(/"/g, '\\"'), 
              true);
          }} />
      </div>
    );
  }

  render() {
    const { currentUser, startDate, preview } = this.state;
    const { allUsers } = this.props;

    return (
      <section>
        <Breadcrumb data={BREADCRUMB.bugweeklyreport} />

        <label>&nbsp;&nbsp;User:&nbsp;</label>
        <DropDownList
          isNeedAll={false}
          title={currentUser.title}
          onOptionClick={this.onChangeSelectUser}
          aryOptionConfig={allUsers.map((user) => {
            return {title: user.name, value: user.id};
          })}
        />

        <label>&nbsp;&nbsp;Date:&nbsp;</label>
        <DateField
          value={startDate}
          onChange={this.changeStartDate}
          dateFormat="YYYY-MM-DD"/>

        {
          preview ? this.renderPreviewContent() : this.renderContent()
        }
      </section>
    );
  }

}
export default connect(
  state => {
    return Object.assign(
      {},
      state.bugReview.toJS(),
      state.bugWeeklyReport.toJS(),
      state.resourceMap.toJS(),
      state.app.toJS()
    );
  },
  dispatch => {
    return Object.assign(
      {},
      bindActionCreators(BugReviewActions, dispatch),
      bindActionCreators(BugWeeklyReportActions, dispatch),
      bindActionCreators(mainActions, dispatch),
      bindActionCreators(appActions, dispatch),
      bindActionCreators(resourceMapActions, dispatch)
    );
  }
)(BugWeeklyReport);
