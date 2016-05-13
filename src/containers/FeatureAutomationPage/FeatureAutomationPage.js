 // Style
import './_FeatureAutomationPage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Paper from 'material-ui/lib/paper';
import moment from 'moment';

import * as FeatureAutomationActions from '../../actions/feature-automation-page-action';
import DropDownList from '../../components/A10-UI/Input/Drop-Down-List.js';

import { depthFirstFlat } from '../../libraries/tree';
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
    fetchTestReportCreatedTimeList();
    fetchDocumentCategoriesWithReport();
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
      title: `${index === 0 ? '(last)': ''} ${moment(item).format('lll')}`,
      value: item
    };
  }

  getCreatedTimeTitle(createdTime, createdTimeList) {
    if (!createdTimeList || createdTimeList.length === 0) {
      return 'No Log';
    }
    if (createdTime === createdTimeList[0] || (!createdTime && createdTimeList.length !== 0) ){
      return `(last)${moment(createdTimeList[0]).format('lll')}`;
    }
    return moment(createdTime).format('lll');
  }

  render() {
    const {
      documentCategoriesWithReportTest,
      unitTestCreatedTimeList,
      end2endTestCreatedTimeList,
      axapiTestCreatedTimeList,
    } = this.props;
    const {
      displayCategoriesId,
      isAxapiEditDialogDisplay,
      editingCategoryId,
      editingAxapis,
      axapiTestCreatedTime,
      end2endTestCreatedTime,
      unitTestCreatedTime
    } = this.state;

    const displayTree = depthFirstFlat(documentCategoriesWithReportTest, (node) => {
      return node.name ==='root' || ( displayCategoriesId.includes(node.id));
    });

    return (
      <div>
        <div className="feature-automation-page">
          <h3>Feature Automation</h3>
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
                {/*
                <span>Pages</span>
                <span>Owners</span>
                <span>Complicate</span>
                */}
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
                      onEditAxapis={::this.openAxapisEditDialog}
                      onPathSave={::this.onPathSave}
                      toggleChildren={::this.toggleChildren}
                      {...row} />
                  );
                }) : (
                  <div style={{padding: 15, textAlign: 'center'}}>No data</div>
                )
              }
            </div>
          </Paper>
        </div>
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
  unitTestCreatedTimeList          : PropTypes.array,
  end2endTestCreatedTimeList       : PropTypes.array,
  axapiTestCreatedTimeList         : PropTypes.array
};

FeatureAutomationPage.defaultProps = {
  unitTestCreatedTimeList: [],
  end2endTestCreatedTimeList: [],
  axapiTestCreatedTimeList: []
};

function mapStateToProps(state) {
  const {
    documentCategoriesWithReportTest,
    unitTestCreatedTimeList,
    end2endTestCreatedTimeList,
    axapiTestCreatedTimeList
  } = state.featureAutomation.toJS();

  return {
    documentCategoriesWithReportTest,
    unitTestCreatedTimeList,
    end2endTestCreatedTimeList,
    axapiTestCreatedTimeList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    featureAutomationActions: bindActionCreators(FeatureAutomationActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeatureAutomationPage);
