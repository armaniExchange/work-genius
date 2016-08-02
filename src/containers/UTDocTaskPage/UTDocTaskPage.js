 // Style
import './_UTDocTaskPage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/lib/table';
import CircularProgress from 'material-ui/lib/circular-progress';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { flatTree } from '../../libraries/tree';

import * as DocumentActions from '../../actions/document-page-actions';
import * as ArticleActions from '../../actions/article-page-actions';
import * as FeatureAutomationActions from '../../actions/feature-automation-page-action';
import * as ResourceMapActions from '../../actions/resource-map-actions';

import UTDocTaskRow from '../../components/UTDocTaskRow/UTDocTaskRow';
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
      filterReviewer: null
    };
  }

  componentDidMount() {
    const { fetchAllUsers } = this.props.documentActions;
    const {
      fetchDocumentCategoriesWithSettings,
    } = this.props.featureAutomationActions;
    fetchAllUsers();
    fetchDocumentCategoriesWithSettings();
  }

  componentWillReceiveProps(nextProps) {
    const { documentCategoriesWithSettings, createdUtDocId } = nextProps;
    if (this.props.createdUtDocId !== createdUtDocId) {
      this.context.history.pushState(null, this.getUTDocArticleRoute(createdUtDocId));
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

  onUTDocClick({
      UTDoc,
      categoryId,
      fullpathWithOutRoot,
    }) {
    if (UTDoc) {
      this.context.history.pushState(null, this.getUTDocArticleRoute(UTDoc));
    } else {
      const { articleActions: { createArticle } }= this.props;
      createArticle({
        title: `UT - ${fullpathWithOutRoot}`,
        categoryId,
        content: 'For UT status',
        documentType: 'test case',
        updateTestReportUt: true
      });
    }
  }

  getUTDocArticleRoute(articleId) {
    return `/main/knowledge/document/edit/${articleId}?prev_page=${encodeURI('/main/resource/ut-status')}`;
  }

  setupTestReportOfCategory(options) {
    const { featureAutomationActions } = this.props;
    const {
      setupTestReportOfCategory,
      fetchDocumentCategoriesWithSettings
    } = featureAutomationActions;
    setupTestReportOfCategory(options, ()=> fetchDocumentCategoriesWithSettings());
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

  render() {
    const {
      allUsers,
      documentCategoriesWithSettings,
      isLoading
    } = this.props;

    const {
      flatCategories,
      filterRelease,
      filterOwner,
      filterReviewer
    } = this.state;

    const filterReleaseOptions = documentCategoriesWithSettings.children || [];
    const displayRows = flatCategories.filter(::this.combinedFilters);
    return (
      <div>
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
                    <TableHeaderColumn style={{width: 200}}>Reviewers</TableHeaderColumn>
                    <TableHeaderColumn style={{width: 130}}><i className="fa fa-calendar-o"/> Doc ETA</TableHeaderColumn>
                    <TableHeaderColumn style={{width: 130}}>Doc Status</TableHeaderColumn>
                    <TableHeaderColumn style={{width: 130}}><i className="fa fa-calendar-o"/> Code ETA</TableHeaderColumn>
                    <TableHeaderColumn style={{width: 130}}>Code Status</TableHeaderColumn>
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
