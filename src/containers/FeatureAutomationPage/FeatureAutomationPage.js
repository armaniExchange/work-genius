 // Style
import './_FeatureAutomationPage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';
import AutoComplete from 'material-ui/lib/auto-complete';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import { depthFirstFlat, filterChildren, flatTree } from '../../libraries/tree';
import * as FeatureAutomationActions from '../../actions/feature-automation-page-action';
import * as DocumentActions from '../../actions/document-page-actions';

import DropDownList from '../../components/A10-UI/Input/Drop-Down-List.js';
import FeatureAutomationRow from '../../components/FeatureAutomationRow/FeatureAutomationRow';
import EditFeatureAutomationAxapiDialog from '../../components/EditFeatureAutomationAxapiDialog/EditFeatureAutomationAxapiDialog';

class FeatureAutomationPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      displayCategoriesId: []
    };
  }

  componentDidMount() {
    const {
      fetchDocumentCategoriesWithReport,
      fetchTestReportCreatedTimeList,
      filterTestReport
    } = this.props.featureAutomationActions;
    const { fetchAllUsers } = this.props.documentActions;

    const { currentUser } = this.props;
    const { privilege, id } = currentUser;
    if (privilege <= 5) {
      filterTestReport({ filterOwner: id });
    }
    fetchTestReportCreatedTimeList();
    fetchDocumentCategoriesWithReport();
    fetchAllUsers();
  }

  toggleChildren({id, forceEnable}) {
    const { displayCategoriesId } = this.state;
    let result = displayCategoriesId;
    if (displayCategoriesId.includes(id)) {
      if (forceEnable === true) {
        // skip remove, keep it in displayCategoriesId
      } else {
        result = displayCategoriesId.filter(eachId => eachId !== id);
      }
    } else {
      result = [...displayCategoriesId, id];
    }
    this.setState({displayCategoriesId: result});
  }

  openAxapisEditDialog(id, axapis) {
    this.setState({
      isAxapiEditDialogDisplay: true,
      editingCategoryId: id,
      editingAxapis: axapis
    });
  }

  closeAxapisEditDialog() {
    this.setState({ isAxapiEditDialogDisplay: false });
  }

  onAxapisSave(id, axapis) {
    this.props.featureAutomationActions.setupTestReportOfCategory({
      categoryId: id,
      axapis
    });
  }

  onPathSave(id, path) {
    this.props.featureAutomationActions.setupTestReportOfCategory({
      categoryId: id,
      path
    });
  }

  onDifficultySave(id, difficulty) {
    this.props.featureAutomationActions.setupTestReportOfCategory({
      categoryId: id,
      difficulty
    });
  }

  onOwnersSave(id, owners) {
    this.props.featureAutomationActions.setupTestReportOfCategory({
      categoryId: id,
      owners
    });
  }

  onUnitTestCreatedTimeChange(value) {
    this.setState({unitTestCreatedTime: value});
  }

  onAxapiTestCreatedTimeChange(value) {
    this.setState({axapiTestCreatedTime: value});
  }

  onEnd2endTestCreatedTimeChange(value) {
    this.setState({end2endTestCreatedTime: value});
  }

  searchByCreatedTime() {
    const {
      unitTestCreatedTime,
      axapiTestCreatedTime,
      end2endTestCreatedTime
    } = this.state;
    const queryObject = Object.assign({},
      unitTestCreatedTime ? { unitTestCreatedTime } : null,
      axapiTestCreatedTime ? { axapiTestCreatedTime } : null,
      end2endTestCreatedTime ? { end2endTestCreatedTime } : null
    );
    this.props.featureAutomationActions.fetchDocumentCategoriesWithReport(queryObject);
  }

  parseCreatedTimeToDropdownListItem(item, index) {
    return {
      title: `${index === 0 ? '(last) ': ''} ${moment(item).format('lll')}`,
      value: item
    };
  }

  getCreatedTimeTitle(createdTime, createdTimeList) {
    if (!createdTimeList || createdTimeList.length === 0) {
      return 'No Log';
    }
    if (createdTime === createdTimeList[0] || (!createdTime && createdTimeList.length !== 0) ){
      return `(last) ${moment(createdTimeList[0]).format('lll')}`;
    }
    return moment(createdTime).format('lll');
  }

  onFilterOwnerChange(value) {
    this.props.featureAutomationActions.filterTestReport({ filterOwner: value });
  }

  onFilterReleaseChange(value) {
    this.props.featureAutomationActions.filterTestReport({ filterRelease: value });
  }

  onFilterCaseChange(value) {
    this.props.featureAutomationActions.filterTestReport({ filterCase: value });
  }

  onFilterCategoryUdpateInput(value) {
    console.log('onFilterCategoryUdpateInput');
    console.log(value);
  }

  getDisplayTree() {
    const {
      documentCategoriesWithReportTest,
      filterOwner,
      filterRelease,
      filterCase
    } = this.props;

    const { displayCategoriesId } = this.state;

    const filteredReleaseChildrenResult = (documentCategoriesWithReportTest.children || []).filter(node => {
      return !filterRelease || node.id === filterRelease;
    });
    const filteredReleaseResult = Object.assign({}, documentCategoriesWithReportTest, {
      children: filteredReleaseChildrenResult
    });
    const filteredTree = filterChildren(filteredReleaseResult, (node) => {
      const owners = node.owners || [];
      const {
        axapiTestFailCount,
        unitTestFailCount,
        end2endTestFailCount
      } = node;
      return (!filterOwner || owners.includes(filterOwner))&&
        (!filterCase || axapiTestFailCount || unitTestFailCount || end2endTestFailCount);
    });

    const displayTree = depthFirstFlat(filteredTree, (node) => {
      return node.name ==='root' || ( displayCategoriesId.includes(node.id));
    }).splice(1); //remove root

    return displayTree;
  }

  _transformToOptions(categories) {
    return flatTree(categories).filter((item) => item.fullpath !== 'root')
      .map((item) => {
        return item.fullpath ? item.fullpath.replace('root/', '').replace(/\//gi, ' > ') : '';
      });
  }

  render() {
    const {
      documentCategoriesWithReportTest,
      unitTestCreatedTimeList,
      end2endTestCreatedTimeList,
      axapiTestCreatedTimeList,
      allUsers,
      isLoading,
      filterOwner,
      filterRelease,
      filterCase
    } = this.props;
    const {
      isAxapiEditDialogDisplay,
      editingCategoryId,
      editingAxapis,
      axapiTestCreatedTime,
      end2endTestCreatedTime,
      unitTestCreatedTime
    } = this.state;

    const displayTree = this.getDisplayTree();
    const filterReleaseOptions = documentCategoriesWithReportTest.children || [];
    const filterCaseOptions = ['Failed'];
    return (
      <div className="feature-automation-page">
        <h3>Feature Automation</h3>
        <div>
          <label>Release:&nbsp;</label>
          <DropDownList
            isNeedAll={true}
            title={filterRelease ? filterReleaseOptions.filter(release=> release.id === filterRelease)[0].name : 'All'}
            onOptionClick={::this.onFilterReleaseChange}
            aryOptionConfig={filterReleaseOptions.map(item => {
              return { title: item.name, value: item.id};
            })}
          />
          <label>Owner:&nbsp;</label>
          <DropDownList
            isNeedAll={true}
            title={filterOwner && allUsers && allUsers.length ? allUsers.filter(user => user.id === filterOwner)[0].name : 'All'}
            onOptionClick={::this.onFilterOwnerChange}
            aryOptionConfig={allUsers.map(item => {
              return { title: item.name, value: item.id};
            })}
          />
          <label>Case:&nbsp;</label>
          <DropDownList
            isNeedAll={true}
            title={filterCase ? filterCaseOptions.filter(eachCase => eachCase)[0] : 'All'}
            onOptionClick={::this.onFilterCaseChange}
            aryOptionConfig={filterCaseOptions.map(item => {
              return { title: item, value: item};
            })}
          />
          <AutoComplete
            hintText="Filter Category"
            dataSource={::this._transformToOptions(documentCategoriesWithReportTest)}
            onUpdateInput={::this.onFilterCategoryUdpateInput}
            animated={false}
            floatingLabelText="Filter Category"
          />
        </div>
        <div>
          <label>End2end:&nbsp;</label>
          <DropDownList
            title={this.getCreatedTimeTitle(end2endTestCreatedTime, end2endTestCreatedTimeList)}
            onOptionClick={::this.onEnd2endTestCreatedTimeChange}
            aryOptionConfig={end2endTestCreatedTimeList.map(this.parseCreatedTimeToDropdownListItem)}
          />
          <label>Unit Test:&nbsp;</label>
          <DropDownList
            title={this.getCreatedTimeTitle(unitTestCreatedTime, unitTestCreatedTimeList)}
            onOptionClick={::this.onUnitTestCreatedTimeChange}
            aryOptionConfig={unitTestCreatedTimeList.map(this.parseCreatedTimeToDropdownListItem)}
          />
          <label>AXAPI:&nbsp;</label>
          <DropDownList
            title={this.getCreatedTimeTitle(axapiTestCreatedTime, axapiTestCreatedTimeList)}
            onOptionClick={::this.onAxapiTestCreatedTimeChange}
            aryOptionConfig={axapiTestCreatedTimeList.map(this.parseCreatedTimeToDropdownListItem)}
          />
          <RaisedButton
            secondary={true}
            style={{float: 'right'}}
            onClick={::this.searchByCreatedTime}
            label="search"
          />
        </div>
        <br />
        <Paper className="table">
          <div className="table-header">
            <div className="table-row">
              <span className="category-name">Category Name</span>
              <span className="owners">Owners</span>
              <span className="difficulty">Difficulty</span>
              <span className="path">Path</span>
              <span className="axapis">AXAPIs</span>
              <span className="articles-count">Unit Test Documents</span>
              <span className="end2end-test">End2end test</span>
              <span className="unit-test">Unit Test</span>
              <span className="axapi-test">AXAPI Test</span>
            </div>
          </div>
          <div className="table-body">
            {
              displayTree.length > 0 ? displayTree.map(row => {
                return (
                  <FeatureAutomationRow
                    key={row.id}
                    allUsers={allUsers}
                    onEditAxapis={::this.openAxapisEditDialog}
                    onPathSave={::this.onPathSave}
                    onOwnersSave={::this.onOwnersSave}
                    onDifficultySave={::this.onDifficultySave}
                    toggleChildren={::this.toggleChildren}
                    isLoading={isLoading}
                    {...row} />
                );
              }) : (
                <div style={{padding: 15, textAlign: 'center'}}>No data</div>
              )
            }
          </div>
        </Paper>
        <EditFeatureAutomationAxapiDialog
          open={isAxapiEditDialogDisplay}
          id={editingCategoryId}
          axapis={editingAxapis}
          onRequestClose={::this.closeAxapisEditDialog}
          onSubmit={::this.onAxapisSave}
        />
      </div>
    );
  }
}

FeatureAutomationPage.propTypes = {
  documentCategoriesWithReportTest : PropTypes.object,
  featureAutomationActions         : PropTypes.object.isRequired,
  documentActions                  : PropTypes.object.isRequired,
  unitTestCreatedTimeList          : PropTypes.array,
  end2endTestCreatedTimeList       : PropTypes.array,
  axapiTestCreatedTimeList         : PropTypes.array,
  allUsers                         : PropTypes.array,
  isLoading                        : PropTypes.bool,
  filterOwner                      : PropTypes.string,
  filterRelease                    : PropTypes.string,
  filterCase                       : PropTypes.string,
  currentUser                      : PropTypes.object
};

FeatureAutomationPage.defaultProps = {
  unitTestCreatedTimeList          : [],
  end2endTestCreatedTimeList       : [],
  axapiTestCreatedTimeList         : [],
  allUsers                         : []
};

function mapStateToProps(state) {
  const {
    filterOwner,
    filterRelease,
    filterCase,
    documentCategoriesWithReportTest,
    unitTestCreatedTimeList,
    end2endTestCreatedTimeList,
    axapiTestCreatedTimeList
  } = state.featureAutomation.toJS();
  const {
    isLoading,
    currentUser
  } = state.app.toJS();
  const { allUsers } = state.documentation.toJS();
  return {
    isLoading,
    currentUser,
    filterOwner,
    filterRelease,
    filterCase,
    documentCategoriesWithReportTest,
    unitTestCreatedTimeList,
    end2endTestCreatedTimeList,
    axapiTestCreatedTimeList,
    allUsers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    documentActions     : bindActionCreators(DocumentActions, dispatch),
    featureAutomationActions: bindActionCreators(FeatureAutomationActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeatureAutomationPage);
