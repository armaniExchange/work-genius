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

import Breadcrumb from '../../components/A10-UI/Breadcrumb';
import BREADCRUMB from '../../constants/breadcrumb';

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
    console.log('unitTestCreatedTimeList');
    console.log(unitTestCreatedTimeList);
    return (
      <div>
        <Breadcrumb data={BREADCRUMB.editDocumentCategory} />
        <div className="feature-automation-page">
          <h3>Feature Automation</h3>
          <div>
            <label>Unit Test:&nbsp;</label>
            <DropDownList
              title={unitTestCreatedTime ? unitTestCreatedTime : 'last'}
              onOptionClick={::this.onUnitTestCreatedTimeChange}
              aryOptionConfig={unitTestCreatedTimeList.map(item => {
                return { title: moment(item).format('lll'), value: item};
              })}
            />
            <label>AXAPI:&nbsp;</label>
            <DropDownList
              title={axapiTestCreatedTime ? axapiTestCreatedTime : 'last'}
              onOptionClick={::this.onAxapiTestCreatedTimeChange}
              aryOptionConfig={axapiTestCreatedTimeList.map(item => {
                return { title: moment(item).format('lll'), value: item};
              })}
            />
            <label>End2end:&nbsp;</label>
            <DropDownList
              title={end2endTestCreatedTime ? end2endTestCreatedTime : 'last'}
              onOptionClick={::this.onEnd2endTestCreatedTimeChange}
              aryOptionConfig={end2endTestCreatedTimeList.map(item => {
                return { title: moment(item).format('lll'), value: item};
              })}
            />
          </div>
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
