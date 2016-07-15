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
    const { documentCategoriesWithSettings } = nextProps;
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

  render() {
    const {
      allUsers,
      documentCategoriesWithSettings,
      isLoading
    } = this.props;

    const {
      filterRelease,
      filterOwner
    } = this.state;

    const filterReleaseOptions = documentCategoriesWithSettings.children || [];

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
            title={filterOwner && allUsers && allUsers.length ? allUsers.filter(user => user.id === filterOwner)[0].name : 'All (ReadOnly)'}
            onOptionClick={::this.onFilterOwnerChange}
            aryOptionConfig={allUsers.map(item => {
              return { title: item.name, value: item.id};
            })}
          />
        </div>
        <br />
        <div style={{width: '100%', textAlign: 'center'}}>
          {
            isLoading ? <CircularProgress /> : (
              <Table height="600px" style={{maxHeight: 700, minWidth: 900}} fixedHeader={true}>
                <TableHeader displaySelectAll={false}>
                  <TableRow>
                    <TableHeaderColumn>Menu List</TableHeaderColumn>
                    <TableHeaderColumn style={{width: 150}}>Owner</TableHeaderColumn>
                    <TableHeaderColumn style={{width: 150}}>Reviewer</TableHeaderColumn>
                    <TableHeaderColumn style={{width: 150}}><i className="fa fa-calendar-o"/> Doc ETA</TableHeaderColumn>
                    <TableHeaderColumn style={{width: 150}}>Doc Status</TableHeaderColumn>
                    <TableHeaderColumn style={{width: 150}}><i className="fa fa-calendar-o"/> Code ETA</TableHeaderColumn>
                    <TableHeaderColumn style={{width: 150}}>Code Status</TableHeaderColumn>
                    <TableHeaderColumn style={{width: 120}}>Status</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody showRowHover={true}>
                  {
                    this.state.flatCategories
                    .filter(item => filterRelease ? item.fullpath && item.fullpath.includes(filterRelease) : true)
                    .filter(item => filterOwner ? item.owners && item.owners[0] === filterOwner : true)
                    .map((task, index)=>{
                      return (
                        <UTDocTaskRow
                          key={index}
                          allUsers={allUsers}
                          isLoading={isLoading}
                          setupTestReportOfCategory={::this.setupTestReportOfCategory}
                          upsertWorklogItem={::this.upsertWorklogItem}
                          readOnly={!filterOwner}
                          {...task} />
                      );
                    })
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
  featureAutomationActions: PropTypes.object.isRequired,
  resourceMapActions: PropTypes.object.isRequired,
  documentCategoriesWithSettings: PropTypes.object,
  currentUser: PropTypes.object,
  allUsers: PropTypes.array,
  isLoading: PropTypes.bool
};

UTDocTaskPage.defaultProps = {
  documentCategoriesWithSettings: {},
  allUsers: []
};

function mapStateToProps(state) {
  const {
    documentCategoriesWithSettings,
    isLoading
  } = state.featureAutomation.toJS();
  const { currentUser } = state.app.toJS();
  const { allUsers } = state.documentation.toJS();
  return {
    documentCategoriesWithSettings,
    isLoading,
    currentUser,
    allUsers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    documentActions          : bindActionCreators(DocumentActions, dispatch),
    featureAutomationActions : bindActionCreators(FeatureAutomationActions, dispatch),
    resourceMapActions       : bindActionCreators(ResourceMapActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UTDocTaskPage);
