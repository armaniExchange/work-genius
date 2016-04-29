// Style
import './_WorkLogPage.css';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import RaisedButton from 'material-ui/lib/raised-button';

// import HighlightMarkdown from '../../components/HighlightMarkdown/HighlightMarkdown';
// import WorkLogEditor from '../../components/WorkLogEditor/WorkLogEditor';

import Breadcrumb from '../../components/A10-UI/Breadcrumb';
import BREADCRUMB from '../../constants/breadcrumb';

import * as WorkLogActions from '../../actions/work-log-actions';
import * as ArticleActions from '../../actions/article-page-actions';

//import DocumentFilterSelectGroup from '../../components/DocumentFilterSelectGroup/DocumentFilterSelectGroup';
import Pagination from 'rc-pagination';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog/ConfirmDeleteDialog';
import WorkLogListItem from '../../components/WorkLogListItem/WorkLogListItem';
import DropDownList from '../../components/A10-UI/Input/Drop-Down-List.js';
import DatePicker from '../../components/A10-UI/Input/Date-Picker.js';
import moment from 'moment';

import WorkLogEditor from '../../components/WorkLogEditor/WorkLogEditor.js';


class WorkLogPage extends Component {

  constructor(props) {
    super(props);

    this._onClickPaginate = ::this._onClickPaginate;
    this.state = {
      isConfirmDeleteArticleDialogVisible: false,
      editingArticle: null
    };
  }

  componentWillMount() {
    const { fetchArticles, fetchAllUsersRequest, getWorkLogs } = this.props.workLogActions;
    fetchAllUsersRequest();
    fetchArticles();
    getWorkLogs();
  }

  queryArticles() {
    // const {
    //   currentPage,
    //   owner,
    //   createdAt,
    // } = this.state;
    // let query = {
    //   page: currentPage,
    //   authorId: owner,
    //   createdAt: createdAt,
    // };
    // Object.keys(query).forEach((key) => {
    //   if (!query[key]) { delete query[key]; }
    // });

    //query
    this.props.workLogActions.fetchArticles();
  }

  onOwnerChange(owner) {
    this.props.workLogActions.updateArticlesQuery({owner: owner});
    setTimeout(() => this.queryArticles(), 0);
  }

  onStartDateChange(startDate) {
    this.props.workLogActions.updateArticlesQuery({startDate: startDate});
    setTimeout(() => this.queryArticles(), 0);
  }

  onPaginate(page) {
    this.props.workLogActions.updateArticlesQuery({currentPage: page});
    setTimeout(() => this.queryArticles(), 0);
  }

  // delete article
  onConfirmDeleteArticleDialogRequestHide() {
    this.setState({
      isConfirmDeleteArticleDialogVisible: false,
      editingArticle: null
    });
  }

  onConfirmDeleteArticle(deletingArticle) {
    const { deleteWorkLog } = this.props.workLogActions;
    // this.props.articleActions.deleteArticle(deletingArticle.id);
    console.log(deletingArticle);
    deleteWorkLog(deletingArticle.id);
  }

  onCancelDeleteArticle() {}

  onArticleDelete(id, index) {
    this.setState({
      isConfirmDeleteArticleDialogVisible: true,
      editingArticle: {
        id,
        index
      }
    });
  }

  _onClickPaginate(index) {
    console.log(index);
  }

  renderWorkLogList() {
    const { articleList } = this.props;

    if (articleList.length === 0) {
      return (
        <div style={{
          textAlign: 'center',
          padding: 30,
          color: 'gray'
        }}>
          <i className="fa fa-file-text-o fa-5x"/>
          <h3>No matching items found.</h3>
        </div>
      );
    }
    return (
      articleList.map((article, index) => {
        return (
          <WorkLogListItem
            key={index}
            index={index}
            onDelete={::this.onArticleDelete}
            {...article}/>
        );
      })
    );
  }

  render() {
    const pageTitle = 'New Work Log';
    const PAGE_SIZE = 5;
    const {
      startDate,
      currentSelectOwner,
      allUsers,
      articleTotalCount,
      currentPage,
      tags
    } = this.props;
    console.log(currentPage);
    const {
      isConfirmDeleteArticleDialogVisible,
      editingArticle
    } = this.state;

    const {
      tagAction,
      createWorkLog,
      updateWorkLog
    } = this.props.workLogActions;

    let pager = {};

    return (
      <section>
        <Breadcrumb data={BREADCRUMB.worklog} />
        <div className="work-log-content">
          <div className="left-side">
            <h3>{pageTitle}</h3>
            <WorkLogEditor
              tags={tags}
              tagActions={tagAction}
              createWorkLog={createWorkLog}
              updateWorkLog={updateWorkLog}
            />
          </div>

          <div className="main-content">
            {/* Owner */}
            <div className = "top-selector pull-left">
              <label>Owner:&nbsp;</label>
              <DropDownList
                isNeedAll={true}
                title={currentSelectOwner}
                onOptionClick={::this.onOwnerChange}
                aryOptionConfig={allUsers.map((user) => {
                                    return {title: user.name, value: user.id};
                                })}
              />
            </div>

            {/* Date */}
            <div className = "top-selector pull-left">
              <label>&nbsp;&nbsp;&nbsp;&nbsp;Date:&nbsp;</label>
            </div>
            <div className = "pull-left">
              <DatePicker
                defaultDate={String(startDate)}
                placeholder="Start Date"
                onChange={::this.onStartDateChange}
              />
            </div>

            {/* Work Logs */}
            <div className = "work-log">
              { this.renderWorkLogList() }
              {
                articleTotalCount > PAGE_SIZE ? (
                  <Pagination
                    onChange={this._onClickPaginate}
                    pageSize={pager.pageRow}
                    current={pager.rowIndex}
                    total={pager.totalRow}
                  />
                ) : null
              }
            </div>
          </div>
          <ConfirmDeleteDialog
            open={isConfirmDeleteArticleDialogVisible}
            data={editingArticle}
            onConfirm={::this.onConfirmDeleteArticle}
            onCancel={::this.onCancelDeleteArticle}
            onRequestClose={::this.onConfirmDeleteArticleDialogRequestHide}
          />
        </div>
      </section>
    );
  }
}

WorkLogPage.propTypes = {
  workLogActions      : PropTypes.object.isRequired,
  articleActions      : PropTypes.object.isRequired,
  startDate           : PropTypes.string.isRequired,
  tags                : PropTypes.array.isRequired,
  currentSelectOwner  : PropTypes.string,
  allUsers            : PropTypes.array,
  articleList         : PropTypes.array,
  articleTotalCount   : PropTypes.number,
  currentPage         : PropTypes.number,
};

WorkLogPage.defaultProps = {
  startDate           : moment().isoWeekday(1).format('YYYY-MM-DD'),
};

function mapStateToProps(state) {
  return state.workLog.toJS();
}

function mapDispatchToProps(dispatch) {
  return {
    workLogActions: bindActionCreators(WorkLogActions, dispatch),
    articleActions: bindActionCreators(ArticleActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkLogPage);
