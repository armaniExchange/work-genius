 // Style
import './_FeatureAutomationPage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';
import AutoComplete from 'material-ui/lib/auto-complete';
import CircularProgress from 'material-ui/lib/circular-progress';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import _ from 'lodash';
import fuzzy from 'fuzzy';

import { depthFirstFlat, filterChildren, flatTree } from '../../libraries/tree';
import * as FeatureAutomationActions from '../../actions/feature-automation-page-action';
import * as DocumentActions from '../../actions/document-page-actions';

import DropDownList from '../../components/A10-UI/Input/Drop-Down-List.js';
import FeatureAutomationRow from '../../components/FeatureAutomationRow/FeatureAutomationRow';
import EditFeatureAutomationSetupDialog from '../../components/EditFeatureAutomationSetupDialog/EditFeatureAutomationSetupDialog';

class FeatureAutomationPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      displayCategoriesId: [],
      flatCategories: [],
      unitTestAngualrCreatedTimeList: [],
      unitTestDjangoCreatedTimeList: []
    };
  }

  componentDidMount() {
    const {
      fetchDocumentCategoriesWithReport,
      fetchTestReportCreatedTimeList,
      fetchTestReportAxapiSuggestions,
      filterTestReport
    } = this.props.featureAutomationActions;
    const { fetchAllUsers } = this.props.documentActions;
    const { currentUser } = this.props;
    const { privilege, id } = currentUser;

    if (privilege <= 5) {
      filterTestReport({ filterOwner: id });
    }
    fetchTestReportAxapiSuggestions();
    fetchTestReportCreatedTimeList();
    fetchDocumentCategoriesWithReport();
    fetchAllUsers();
  }

  componentWillReceiveProps(nextProps) {
    const {
      documentCategoriesWithReportTest,
      filterOwner,
      unitTestCreatedTimeList
    } = nextProps;

    const thisDocumentCategoriesWithReportTest = this.props.documentCategoriesWithReportTest;
    const isFirstLoaded = !thisDocumentCategoriesWithReportTest.children && thisDocumentCategoriesWithReportTest.children !== documentCategoriesWithReportTest.children;

    if (thisDocumentCategoriesWithReportTest !== documentCategoriesWithReportTest ) {
      this.setState({ flatCategories: flatTree(documentCategoriesWithReportTest) });
    }

    // display at least two layers
    const defaultDisplayCategoriesId = documentCategoriesWithReportTest && documentCategoriesWithReportTest.children ? [
        ...documentCategoriesWithReportTest.children.map(item=>item.id),
        ...documentCategoriesWithReportTest.children.reduce((prev, current) => [...prev, ...current.children], []).map(item=>item.id)
      ].sort()
      .reduce((prev, current) => prev.includes(current) ? prev : [...prev, current], []) : [];

    if ((isFirstLoaded && filterOwner) || (this.props.filterOwner !== filterOwner) ){
      const toBeDisplayedCategoriesId = depthFirstFlat(documentCategoriesWithReportTest, (node) => node.accumOwners.includes(filterOwner) || node.owners.includes(filterOwner))
        .splice(1).map(item => item.id);
      this.setState({ displayCategoriesId: [...toBeDisplayedCategoriesId, ...defaultDisplayCategoriesId] });
    } else if (isFirstLoaded) {
      this.setState({ displayCategoriesId: defaultDisplayCategoriesId });
    }

    if (unitTestCreatedTimeList !== this.props.unitTestCreatedTimeList) {
      this.setState({
        unitTestAngualrCreatedTimeList: unitTestCreatedTimeList.filter(item => item.framework === 'angular'),
        unitTestDjangoCreatedTimeList: unitTestCreatedTimeList.filter(item => item.framework === 'django')
      });
    }
  }

  onPageSettingSave(id, axapis, path) {
    const { featureAutomationActions } = this.props;
    const {
      setupTestReportOfCategory,
      fetchDocumentCategoriesWithReport
    } = featureAutomationActions;
    setupTestReportOfCategory({
      categoryId: id,
      axapis,
      path
    }, fetchDocumentCategoriesWithReport);
  }

  onOwnersSave(id, owners) {
    const { featureAutomationActions } = this.props;
    const {
      setupTestReportOfCategory,
      fetchDocumentCategoriesWithReport
    } = featureAutomationActions;
    setupTestReportOfCategory({
      categoryId: id,
      owners
    }, fetchDocumentCategoriesWithReport);
  }

  onAxapiTestCreatedTimeChange(value) {
    this.setState({ axapiTestCreatedTime: value });
  }

  onEnd2endTestCreatedTimeChange(value) {
    this.setState({ end2endTestCreatedTime: value });
  }

  onUnitTestAngularCreatedTimeChange(value) {
    this.setState({ unitTestAngularCreatedTime: value });
  }

  onUnitTestDjangoCreatedTimeChange(value) {
    this.setState({ unitTestDjangoCreatedTime: value });
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

  onSearchCategoryNameUpdateInput(value) {
    this.props.featureAutomationActions.searchAutomationCategoryByName(value);
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

  openAxapisEditDialog(id, axapis, path) {
    this.setState({
      isAxapiEditDialogDisplay: true,
      editingCategoryId: id,
      editingAxapis: axapis,
      editingPath: path
    });
  }

  closeAxapisEditDialog() {
    this.setState({ isAxapiEditDialogDisplay: false });
  }

  searchByCreatedTime() {
    const {
      axapiTestCreatedTime,
      end2endTestCreatedTime,
      unitTestAngularCreatedTime,
      unitTestDjangoCreatedTime,
    } = this.state;

    let axapiTestQuery = [];
    let end2endTestQuery = [];
    let unitTestQuery = [];

    if (axapiTestCreatedTime) {
      axapiTestQuery.push({ createdAt: axapiTestCreatedTime });
    }

    if (end2endTestCreatedTime) {
      end2endTestQuery.push({ createdAt: end2endTestCreatedTime });
    }

    if (unitTestAngularCreatedTime) {
      unitTestQuery.push({ createdAt: unitTestAngularCreatedTime, framework: 'angular' });
    }

    if (unitTestDjangoCreatedTime) {
      unitTestQuery.push({ createdAt: unitTestDjangoCreatedTime, framework: 'django' });
    }

    const queryObject = Object.assign({},
      axapiTestQuery.length > 0 ? { axapiTestQuery } : null,
      end2endTestQuery.length > 0 ? { end2endTestQuery } : null,
      unitTestQuery.length > 0 ? { unitTestQuery } : null,
    );
    this.props.featureAutomationActions.fetchDocumentCategoriesWithReport(queryObject);
  }

  parseCreatedTimeToDropdownListItem(item, index) {
    return {
      title: `${index === 0 ? '(last) ': ''} ${moment(item.createdAt).format('lll')}`,
      value: item.createdAt
    };
  }

  getCreatedTimeTitle(createdTime, createdTimeList) {
    if (!createdTimeList || createdTimeList.length === 0) {
      return 'No Log';
    }
    if (createdTime === createdTimeList[0] || (!createdTime && createdTimeList.length !== 0) ){
      return `(last) ${moment(createdTimeList[0].createdAt).format('lll')}`;
    }
    return moment(createdTime).format('lll');
  }

  getDisplayTree() {
    const {
      documentCategoriesWithReportTest,
      filterOwner,
      filterRelease,
      filterCase
    } = this.props;

    const {
      displayCategoriesId,
    } = this.state;

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
      return (!filterOwner || owners.includes(filterOwner)) &&
        (!filterCase || axapiTestFailCount || unitTestFailCount || end2endTestFailCount);
    });

    const matchedCategories = this.getMatchedCategories();
    const displayTree = depthFirstFlat(filteredTree, (node) => node.name ==='root' || ( displayCategoriesId.includes(node.id)) || (matchedCategories.length < 10 && matchedCategories.includes(node.id)))
      .splice(1) // remove root
      .filter(item=> matchedCategories.includes(item.id));

    return displayTree;
  }

  getMatchedCategories() {
    const {
      flatCategories,
    } = this.state;
    const {
      searchCategoryName
    } = this.props;
    const matchedCategories = flatCategories.filter(item=> item && item.fullpath && item.fullpath.toLowerCase().includes(searchCategoryName.toLowerCase()))
      .reduce((prev, current)=> [...prev, ...current.parentIds ], [])
      .reduce((prev, current)=> prev.includes(current) ? prev : [...prev, current], []) || [];
    return matchedCategories;
  }

  filterSearchCategoryName(searchText, key) {
    var result = fuzzy.filter(searchText.toLowerCase(), [key.toLowerCase()]);
    return result.length > 0;
  }

  getSearchCategoryNameDataSource() {
    const {
      flatCategories
    } = this.state;
    const {
      searchCategoryName,
      filterOwner,
    } = this.props;

    return flatCategories.filter((item) => item.fullpath !== 'root')
      .filter(item => !filterOwner || (item.owners && item.owners.includes(filterOwner)) )
      .map((item) =>  item.fullpath ? item.fullpath.replace('root > ', '') : '' )
      .filter((categoryName)=> this.filterSearchCategoryName(searchCategoryName, categoryName))
      .splice(0, 5);
  }

  render() {
    const {
      documentCategoriesWithReportTest,
      end2endTestCreatedTimeList,
      axapiTestCreatedTimeList,
      testReportAxapiSuggestions,
      allUsers,
      isLoading,
      filterOwner,
      filterRelease,
      filterCase
    } = this.props;
    const {
      isAxapiEditDialogDisplay,
      editingCategoryId,
      editingPath,
      editingAxapis,
      axapiTestCreatedTime,
      end2endTestCreatedTime,
      unitTestAngularCreatedTime,
      unitTestDjangoCreatedTime,
      unitTestAngualrCreatedTimeList,
      unitTestDjangoCreatedTimeList
    } = this.state;

    const displayTree = this.getDisplayTree();
    const filterReleaseOptions = documentCategoriesWithReportTest.children || [];
    const filterCaseOptions = ['Failed'];
    const tableLoadingCoverStyle = {
      height: '100%',
      width: '100%',
      position: 'absolute',
      zIndex: 1,
      background: 'rgba(0,0,0,0.2)',
      textAlign: 'center',
      paddingTop: 10
    };

    return (
      <div className="feature-automation-page">
        <div style={{display: 'flex', position: 'relative'}}>
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
          </div>
          <div style={{width: 20}}/>
          <div style={{flex: 1, top: -32, position: 'relative'}}>
            <AutoComplete
              hintText="Search Category"
              dataSource={::this.getSearchCategoryNameDataSource()}
              onUpdateInput={_.debounce(::this.onSearchCategoryNameUpdateInput, 100)}
              onNewRequest={::this.onSearchCategoryNameUpdateInput}
              filter={::this.filterSearchCategoryName}
              floatingLabelText="Search Category"
              fullWidth={true}
            />
          </div>
        </div>
        <div>
          <label>End2end:&nbsp;</label>
          <DropDownList
            title={this.getCreatedTimeTitle(end2endTestCreatedTime, end2endTestCreatedTimeList)}
            onOptionClick={::this.onEnd2endTestCreatedTimeChange}
            aryOptionConfig={end2endTestCreatedTimeList.map(this.parseCreatedTimeToDropdownListItem)}
          />
          <label>Unit Test Angular:&nbsp;</label>
          <DropDownList
            title={this.getCreatedTimeTitle(unitTestAngularCreatedTime, unitTestAngualrCreatedTimeList)}
            onOptionClick={::this.onUnitTestAngularCreatedTimeChange}
            aryOptionConfig={unitTestAngualrCreatedTimeList.map(this.parseCreatedTimeToDropdownListItem)}
        />
          <label>Unit Test Django:&nbsp;</label>
          <DropDownList
            title={this.getCreatedTimeTitle(unitTestDjangoCreatedTime, unitTestDjangoCreatedTimeList)}
            onOptionClick={::this.onUnitTestDjangoCreatedTimeChange}
            aryOptionConfig={unitTestDjangoCreatedTimeList.map(this.parseCreatedTimeToDropdownListItem)}
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
              <span className="page-settings"> <i className="fa fa-gears" /> Page Setting</span>
              <span className="articles-count">UT Doc</span>
              <span className="end2end-test">End2end test</span>
              <span className="unit-test">Unit Test <br /> Angular</span>
              <span className="unit-test">Unit Test <br /> Django</span>
              <span className="axapi-test">AXAPI Test</span>
            </div>
          </div>
          <div className="table-body" style={{position: 'relative'}}>
            {
              isLoading ? <div style={
                Object.assign({},
                  tableLoadingCoverStyle,
                  isLoading ? {background: 'rgba(0,0,0,0)'} : null)
              }> <CircularProgress /></div> : null
            }
            {
              displayTree.length > 0 ? displayTree.map(row => {
                return (
                  <FeatureAutomationRow
                    key={row.id}
                    allUsers={allUsers}
                    onEditAxapis={::this.openAxapisEditDialog}
                    onOwnersSave={::this.onOwnersSave}
                    toggleChildren={::this.toggleChildren}
                    isLoading={isLoading}
                    {...row} />
                );
              }) : isLoading ? null : (
                <div style={{padding: 15, textAlign: 'center'}}>No data</div>
              )
            }
          </div>
        </Paper>
        <EditFeatureAutomationSetupDialog
          open={isAxapiEditDialogDisplay}
          id={editingCategoryId}
          axapis={editingAxapis}
          path={editingPath}
          testReportAxapiSuggestions={testReportAxapiSuggestions}
          onRequestClose={::this.closeAxapisEditDialog}
          onSubmit={::this.onPageSettingSave}
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
  testReportAxapiSuggestions       : PropTypes.array,
  isLoading                        : PropTypes.bool,
  filterOwner                      : PropTypes.string,
  filterRelease                    : PropTypes.string,
  filterCase                       : PropTypes.string,
  searchCategoryName               : PropTypes.string,
  currentUser                      : PropTypes.object
};

FeatureAutomationPage.defaultProps = {
  unitTestCreatedTimeList          : [],
  end2endTestCreatedTimeList       : [],
  axapiTestCreatedTimeList         : [],
  testReportAxapiSuggestions       : [],
  allUsers                         : []
};

function mapStateToProps(state) {
  const {
    filterOwner,
    filterRelease,
    filterCase,
    searchCategoryName,
    documentCategoriesWithReportTest,
    unitTestCreatedTimeList,
    end2endTestCreatedTimeList,
    axapiTestCreatedTimeList,
    testReportAxapiSuggestions,
    isLoading
  } = state.featureAutomation.toJS();
  const {
    currentUser
  } = state.app.toJS();
  const { allUsers } = state.documentation.toJS();
  return {
    isLoading,
    currentUser,
    filterOwner,
    filterRelease,
    filterCase,
    searchCategoryName,
    documentCategoriesWithReportTest,
    unitTestCreatedTimeList,
    end2endTestCreatedTimeList,
    axapiTestCreatedTimeList,
    testReportAxapiSuggestions,
    allUsers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    documentActions          : bindActionCreators(DocumentActions, dispatch),
    featureAutomationActions : bindActionCreators(FeatureAutomationActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeatureAutomationPage);
