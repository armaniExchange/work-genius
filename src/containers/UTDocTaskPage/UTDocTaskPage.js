 // Style
import './_UTDocTaskPage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/lib/table';
import CircularProgress from 'material-ui/lib/circular-progress';
import RaisedButton from 'material-ui/lib/raised-button';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { flatTree } from '../../libraries/tree';

import * as DocumentActions from '../../actions/document-page-actions';
import * as ArticleActions from '../../actions/article-page-actions';
import * as FeatureAutomationActions from '../../actions/feature-automation-page-action';
import * as ResourceMapActions from '../../actions/resource-map-actions';

import UTDocTaskRow from '../../components/UTDocTaskRow/UTDocTaskRow';
import UTCheckListDialog from '../../components/UTCheckListDialog/UTCheckListDialog';
import DropDownList from '../../components/A10-UI/Input/Drop-Down-List.js';


class UTDocTaskPage extends Component {

  constructor(props) {
    super(props);
    const { currentUser } = props;
    const { privilege, id } = currentUser;
    this.state = {
      flatCategories: [],
      filterOwner: privilege <= 5 ? id : null,
      filterRelease: 'root > 4.1',
      filterReviewer: null,
      showCheckListDialog: false,
      editingCategoryId: null,
      editingFullpathWithOutRoot: '',
      editingCheckList: [],
      editingCheckListDefinition: 'default'
    };
  }

  componentDidMount() {
    const { fetchAllUsers } = this.props.documentActions;
    const {
      fetchDocumentCategoriesWithSettings
    } = this.props.featureAutomationActions;
    fetchAllUsers();
    fetchDocumentCategoriesWithSettings();
  }

  componentWillReceiveProps(nextProps) {
    const { documentCategoriesWithSettings, createdUtDocId } = nextProps;
    if (this.props.createdUtDocId !== createdUtDocId) {
      window.open(this.getUTDocEditArticleRoute(createdUtDocId));
    }
    const thisDocumentCategoriesWithSettings = this.props.documentCategoriesWithSettings;
    if (thisDocumentCategoriesWithSettings !== documentCategoriesWithSettings ) {
      this.setState({
        flatCategories: flatTree(documentCategoriesWithSettings)
          .map(item=>Object.assign({fullpathWithOutRoot: item.fullpath ? item.fullpath.replace('root > ', '') : ''}, item))
      });
    }
  }

  onFilterReleaseChange(value) {
    this.setState({ filterRelease: value });
  }

  onFilterOwnerChange(value) {
    this.setState({ filterOwner: value });
  }

  onFilterReviewerChange(value) {
    this.setState({ filterReviewer: value });
  }

  onCreateBugClick({
      checkListId,
      categoryId,
      fullpathWithOutRoot,
      bugArticle
    }) {
    const {
      articleActions: { createArticle },
      featureAutomationActions: { fetchDocumentCategoryWithSettings }
    } = this.props;
    if (bugArticle) {
      window.open(this.getBugViewArticleRoute(bugArticle));
    } else {
      createArticle({
        title: `Bug - ${fullpathWithOutRoot}`,
        categoryId,
        checkListId,
        documentType: 'bugs',
        updateCheckListBug: true,
        draft: true
      }, () => {
        fetchDocumentCategoryWithSettings(categoryId);
      });
    }
  }

  onRemoveBugClick({
    bugArticle,
    checkListId,
    categoryId,
  }) {
    const { articleActions: { deleteArticle } }= this.props;
    const { editingCheckList } = this.state;
    deleteArticle(bugArticle);
    const data = Object.assign([], editingCheckList);
    const checkList = data.map(item=>{
      if (item.id === checkListId || !item.bugArticle) {
        delete item.bugArticle;
      }
      return item;
    });
    this.setupTestReportOfCategory({
      categoryId,
      checkList
    });
  }

  onUTDocClick({
      UTDoc,
      categoryId,
      fullpathWithOutRoot,
    }) {
    if (UTDoc) {
      this.context.history.pushState(null, this.getUTDocEditArticleRoute(UTDoc));
    } else {
      const { articleActions: { createArticle } }= this.props;
      createArticle({
        title: `UT Doc - ${fullpathWithOutRoot}`,
        categoryId,
        content: 'For UT status\n',
        documentType: 'test case',
        updateTestReportUt: true
      });
    }
  }

  getUTDocEditArticleRoute(articleId) {
    return `/main/knowledge/document/edit/${articleId}?close_window=true`;
  }

  getBugViewArticleRoute(articleId) {
    return `/main/knowledge/document/${articleId}?close_window=true`;
  }

  setupTestReportOfCategory(options) {
    const { featureAutomationActions } = this.props;
    const {
      setupTestReportOfCategory,
      fetchDocumentCategoryWithSettings
    } = featureAutomationActions;
    setupTestReportOfCategory(options, ()=> {
      fetchDocumentCategoryWithSettings(options.categoryId);
    });
  }

  upsertWorklogItem(options) {
    const { resourceMapActions } = this.props;
    const { upsertWorklogItem} = resourceMapActions;
    upsertWorklogItem(options);
  }

  combinedFilters(item) {
    const {
      filterRelease,
      filterOwner,
      filterReviewer
    } = this.state;
    let result = true;
    result = result && (filterRelease ? item.fullpath && item.fullpath.includes(filterRelease) : true);
    result = result && (filterOwner ? item.owners && item.owners[0] === filterOwner : true);
    result = result && (filterReviewer ? item.owners && item.owners.slice(1).includes(filterReviewer): true);
    return result;
  }

  openCheckList({id, checkList, fullpathWithOutRoot}) {
    this.setState({
      editingCategoryId: id,
      showCheckListDialog: true,
      editingCheckList: checkList,
      editingFullpathWithOutRoot: fullpathWithOutRoot,
      editingCheckListDefinition: fullpathWithOutRoot.split('>')[0].trim()
    });
  }

  closeCheckList() {
    this.setState({
      editingCategoryId: null,
      showCheckListDialog: false,
      editingCheckList: [],
      editingFullpathWithOutRoot: ''
    });
  }

  onUTCheckListDialogSubmit({categoryId, data}) {
    this.setupTestReportOfCategory({
      categoryId,
      checkList: data
    });
  }

  refresh() {
    const {
      featureAutomationActions: {
        fetchDocumentCategoriesWithSettings
      }
    } = this.props;
    fetchDocumentCategoriesWithSettings();
  }

  renderDisplayBugStatistic(displayRows) {
    const totalCategoriesLength = displayRows.length || 1;
    const CategoriesisCheckListDoneLength = displayRows.filter(item=>item.isCheckListDone).length;
    const bugStatistic = displayRows
      .map(item=>item.bugStatistic)
      .reduce((accum, current)=>{
        return current ? {
          new:  accum.new + current.new ,
          resolved:  accum.resolved + current.resolved ,
          verified:  accum.verified + current.verified ,
          reopened:  accum.reopened + current.reopened ,
          total: accum.total + current.total
        } : accum;
      }, {
        new: 0,
        resolved: 0,
        verified: 0,
        reopened: 0,
        total: 0
      });

    return (
      <div className="pull-right" style={{lineHeight: '2.5em'}}>
        <label>
          {`Coverage: ${((CategoriesisCheckListDoneLength * 100 )/(totalCategoriesLength)).toFixed(2)}%`}
        </label>
        <span>&nbsp;&nbsp;&nbsp;</span>
        <label>
          Bugs: <span style={{color: bugStatistic.verified === bugStatistic.total ? null : 'red'}}>{bugStatistic.verified}</span>/{bugStatistic.total}
        </label>
        <span>&nbsp;&nbsp;&nbsp;</span>
      </div>
    );
  }

  render() {
    const {
      allUsers,
      documentCategoriesWithSettings,
      isLoading,
    } = this.props;
    const {
      flatCategories,
      filterRelease,
      filterOwner,
      filterReviewer,
      showCheckListDialog,
      editingCategoryId,
      editingCheckList,
      editingFullpathWithOutRoot,
      editingCheckListDefinition
    } = this.state;

    const filterReleaseOptions = documentCategoriesWithSettings.children || [];
    const displayRows = flatCategories.filter(::this.combinedFilters);
    return (
      <div>
        <UTCheckListDialog
          open={showCheckListDialog}
          onRequestClose={::this.closeCheckList}
          onSubmit={::this.onUTCheckListDialogSubmit}
          data={editingCheckList}
          categoryId={editingCategoryId}
          onCreateBugClick={::this.onCreateBugClick}
          onRemoveBugClick={::this.onRemoveBugClick}
          fullpathWithOutRoot={editingFullpathWithOutRoot}
          release={editingCheckListDefinition}
        />
        <div>
          <label>Release:&nbsp;</label>
          <DropDownList
            isNeedAll={true}
            title={filterReleaseOptions.length === 0 ? 'loading' : filterRelease ? filterReleaseOptions.filter(release=> release.fullpath === filterRelease)[0].name : 'All'}
            onOptionClick={::this.onFilterReleaseChange}
            aryOptionConfig={filterReleaseOptions.map(item => {
              return { title: item.name, value: item.fullpath};
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
          <label>Reviewer:&nbsp;</label>
          <DropDownList
            isNeedAll={true}
            title={filterReviewer && allUsers && allUsers.length ? allUsers.filter(user => user.id === filterReviewer)[0].name : 'All'}
            onOptionClick={::this.onFilterReviewerChange}
            aryOptionConfig={allUsers.map(item => {
              return { title: item.name, value: item.id};
            })}
          />
          <RaisedButton
            secondary={true}
            style={{float: 'right'}}
            onClick={::this.refresh}
            label="refresh"
          />
          {this.renderDisplayBugStatistic(displayRows)}
        </div>
        <br />
        <div style={{width: '100%', textAlign: 'center'}}>
          {
            isLoading && this.state.flatCategories.length <= 1 ? <CircularProgress /> : (
              <Table height="600px" style={{maxHeight: 700, minWidth: 900}} fixedHeader={true}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                  <TableRow>
                    <TableHeaderColumn>Menu List</TableHeaderColumn>
                    <TableHeaderColumn style={{width: 150}}>Owner</TableHeaderColumn>
                    <TableHeaderColumn style={{width: 180}}>Reviewers</TableHeaderColumn>
                    <TableHeaderColumn style={{width: 120}}>Check List</TableHeaderColumn>
                    <TableHeaderColumn style={{width: 130}}>Bugs</TableHeaderColumn>
                    <TableHeaderColumn style={{width: 150}}><i className="fa fa-calendar-o"/> Code ETA</TableHeaderColumn>
                    <TableHeaderColumn style={{width: 120}}>Code Status</TableHeaderColumn>
                    <TableHeaderColumn style={{width: 120}}>Status</TableHeaderColumn>

                  </TableRow>
                </TableHeader>
                <TableBody showRowHover={true}>
                  {
                    displayRows.length > 0 ? displayRows.map((task)=>{
                      return (
                        <UTDocTaskRow
                          key={task.id}
                          allUsers={allUsers}
                          isLoading={isLoading}
                          onUTDocClick={::this.onUTDocClick}
                          openCheckList={::this.openCheckList}
                          setupTestReportOfCategory={::this.setupTestReportOfCategory}
                          upsertWorklogItem={::this.upsertWorklogItem}
                          readOnly={!filterOwner && !filterReviewer}
                          readOnlyText="Reand Only, Choose Owner or Reviewer to Edit"
                          {...task} />
                      );
                    }) : (
                      <UTDocTaskRow isEmpty={true}/>
                    )
                  }
                </TableBody>
              </Table>
            )
          }
        </div>

      </div>
    );
  }
}

UTDocTaskPage.propTypes = {
  documentActions: PropTypes.object.isRequired,
  articleActions     : PropTypes.object.isRequired,
  featureAutomationActions: PropTypes.object.isRequired,
  resourceMapActions: PropTypes.object.isRequired,
  documentCategoriesWithSettings: PropTypes.object,
  currentUser: PropTypes.object,
  allUsers: PropTypes.array,
  isLoading: PropTypes.bool,
  createdUtDocId: PropTypes.string
};

UTDocTaskPage.defaultProps = {
  documentCategoriesWithSettings: {},
  allUsers: []
};

UTDocTaskPage.contextTypes = { history: PropTypes.any };

function mapStateToProps(state) {
  const {
    documentCategoriesWithSettings,
    createdUtDocId,
    isLoading
  } = state.featureAutomation.toJS();
  const { currentUser } = state.app.toJS();
  const { allUsers } = state.documentation.toJS();
  return {
    documentCategoriesWithSettings,
    createdUtDocId,
    isLoading,
    currentUser,
    allUsers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    documentActions          : bindActionCreators(DocumentActions, dispatch),
    articleActions           : bindActionCreators(ArticleActions, dispatch),
    featureAutomationActions : bindActionCreators(FeatureAutomationActions, dispatch),
    resourceMapActions       : bindActionCreators(ResourceMapActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UTDocTaskPage);
