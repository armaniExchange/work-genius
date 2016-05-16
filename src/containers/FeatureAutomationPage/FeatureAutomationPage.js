 // Style
import './_FeatureAutomationPage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Paper from 'material-ui/lib/paper';
import moment from 'moment';

import * as FeatureAutomationActions from '../../actions/feature-automation-page-action';
import * as DocumentActions from '../../actions/document-page-actions';

import DropDownList from '../../components/A10-UI/Input/Drop-Down-List.js';
import { depthFirstFlat, filterChildren } from '../../libraries/tree';
import FeatureAutomationRow from '../../components/FeatureAutomationRow/FeatureAutomationRow';
import EditFeatureAutomationAxapiDialog from '../../components/EditFeatureAutomationAxapiDialog/EditFeatureAutomationAxapiDialog';
import RaisedButton from 'material-ui/lib/raised-button';

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
      fetchTestReportCreatedTimeList
    } = this.props.featureAutomationActions;
    const { fetchAllUsers } = this.props.documentActions;

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

  getDisplayTree() {
    const {
      documentCategoriesWithReportTest,
      filterOwner
    } = this.props;

    const { displayCategoriesId } = this.state;

    const filteredTree = filterChildren(documentCategoriesWithReportTest, (node) => {
      return filterOwner ? (node.owners || [] ).includes(filterOwner) : true;
    });

    const displayTree = depthFirstFlat(filteredTree, (node) => {
      return node.name ==='root' || ( displayCategoriesId.includes(node.id));
    }).splice(1); //remove root

    return displayTree;
  }

  render() {
    const {
      unitTestCreatedTimeList,
      end2endTestCreatedTimeList,
      axapiTestCreatedTimeList,
      allUsers,
      isLoading,
      filterOwner
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
    return (
      <div className="feature-automation-page">
        <h3>Feature Automation</h3>
        <div>
          <label>Owner:&nbsp;</label>
          <DropDownList
            isNeedAll={true}
            title={filterOwner ? allUsers.filter(user=> user.id === filterOwner)[0].name : 'All'}
            onOptionClick={::this.onFilterOwnerChange}
            aryOptionConfig={allUsers.map(item => {
              return { title: item.name, value: item.id};
            })}
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
  filterOwner                      : PropTypes.number
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
    documentCategoriesWithReportTest,
    unitTestCreatedTimeList,
    end2endTestCreatedTimeList,
    axapiTestCreatedTimeList
  } = state.featureAutomation.toJS();
  const { allUsers } = state.documentation.toJS();
  const { isLoading } = state.app.toJS();
  return {
    filterOwner,
    isLoading,
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
