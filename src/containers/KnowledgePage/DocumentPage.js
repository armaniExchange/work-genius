// Style
import './_DocumentPage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import Pagination from 'rc-pagination';
import RaisedButton from 'material-ui/lib/raised-button';

import Breadcrumb from '../../components/A10-UI/Breadcrumb';
import BREADCRUMB from '../../constants/breadcrumb';

import ArticleListItem from '../../components/ArticleListItem/ArticleListItem';
import ArticleTagList from '../../components/ArticleTagList/ArticleTagList';
import CategoryTree from '../../components/CategoryTree/CategoryTree';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog/ConfirmDeleteDialog';
import DocumentFilterSelectGroup from '../../components/DocumentFilterSelectGroup/DocumentFilterSelectGroup';

import * as DocumentActions from '../../actions/document-page-actions';
import * as ArticleActions from '../../actions/article-page-actions';

class DocumentPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // the delete state
      isConfirmDeleteArticleDialogVisible: false,
      editingArticle: null
    };
  }

  componentWillMount() {
    const {
      fetchAllCategories,
      fetchAllTags,
      fetchAllUsers,
      fetchAllMilestones
    } = this.props.documentActions;

    // Todo: find a better way to handle jumpling this page from other page
    fetchAllCategories();
    fetchAllTags();
    fetchAllUsers();
    fetchAllMilestones();
    this.queryArticles();
  }

  // fetch articles with query
  //
  onTagChange(tag) {
    this.props.documentActions.updateArticlesQuery({tag});
    setTimeout(() => this.queryArticles(), 0);
  }

  onFilterChange(filter) {
    this.props.documentActions.updateArticlesQuery(filter);
    setTimeout(() => this.queryArticles(), 0);
  }

  onPaginate(page) {
    this.props.documentActions.updateArticlesQuery({currentPage: page});
    setTimeout(() => this.queryArticles(), 0);
  }

  queryArticles() {
    const {
      currentPage,
      tag,
      documentType,
      priority,
      milestone,
      owner,
    } = this.props;
    let query = {
      page: currentPage,
      tag: tag,
      authorId: owner,
      documentType,
      priority,
      milestone,
    };
    Object.keys(query).forEach((key) => {
      if (!query[key]) { delete query[key]; }
    });

    this.props.documentActions.fetchArticles(query);
  }

  // delete article
  onConfirmDeleteArticleDialogRequestHide() {
    this.setState({
      isConfirmDeleteArticleDialogVisible: false,
      editingArticle: null
    });
  }

  onConfirmDeleteArticle(deletingArticle) {
    // console.log(`delete article id:${deletingArticle.id} index:${deletingArticle.index}`);
    this.props.articleActions.deleteArticle(deletingArticle.id);
  }

  onArticleDelete(id, index) {
    this.setState({
      isConfirmDeleteArticleDialogVisible: true,
      editingArticle: {
        id,
        index
      }
    });
  }

  onCancelDeleteArticle() {}

  renderArticleList() {
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
          <ArticleListItem
            key={index}
            index={index}
            onDelete={::this.onArticleDelete}
            {...article}/>
        );
      })
    );
  }

  _onNodeClick(item) {
    this.props.documentActions.setSelectedCategory({...item, isLeaf: false});
  }

  _setAndFetchCategory(item) {
    const { documentActions } = this.props;
    documentActions.setSelectedCategory({...item, isLeaf: true});
    this.props.documentActions.updateArticlesQuery({categoryId: item.path || ''});
    setTimeout(() => this.queryArticles(), 0);
  }

  _clearCategory() {
    this._setAndFetchCategory({});
  }

  render() {
    const PAGE_SIZE = 5;
    const {
      allUsers,
      allMilestones,
      allTags,
      allCategories,
      articleTotalCount,
      currentSelectedCategory,
      documentType,
      priority,
      milestone,
      owner,
      tag,
      currentPage
    } = this.props;
    const {
      isConfirmDeleteArticleDialogVisible,
      editingArticle
    } = this.state;

    return (
      <section>
        <Breadcrumb data={BREADCRUMB.document} />
        <div className="document-page-content">
          <div className="left-navigation">
            <Link to="/main/knowledge/document/edit/new">
              <RaisedButton
                label="+ Create a Document"
                secondary={true} />
            </Link>
            <h5>Hot tags</h5>
            <ArticleTagList
              onChange={::this.onTagChange}
              tags={allTags}
              value={tag} />
            <h5>Tree</h5>
            <RaisedButton
              label="Show All Articles"
              secondary={true}
              onClick={::this._clearCategory} />
            <CategoryTree
                data={allCategories}
                selectedPath={currentSelectedCategory.path}
                onNodeClick={::this._onNodeClick}
                onLeafClick={::this._setAndFetchCategory} />
          </div>
          <div className="main-content">
            <DocumentFilterSelectGroup
              allUsers={allUsers}
              allMilestones={allMilestones}
              documentType={documentType}
              priority={priority}
              milestone={milestone}
              owner={owner}
              onChange={::this.onFilterChange}
            />
            { this.renderArticleList() }
            {
              articleTotalCount > PAGE_SIZE ? (
                <Pagination
                  onChange={::this.onPaginate}
                  pageSize={PAGE_SIZE}
                  current={currentPage}
                  total={articleTotalCount} />
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
      </section>
    );
  }
}

DocumentPage.propTypes = {
  articleList             : PropTypes.array,
  articleTotalCount       : PropTypes.number,
  allCategories           : PropTypes.object,
  currentSelectedCategory : PropTypes.object,
  allTags                 : PropTypes.array,
  allUsers                : PropTypes.array,
  allMilestones           : PropTypes.array,
  documentActions         : PropTypes.object.isRequired,
  articleActions          : PropTypes.object.isRequired,
  // query object
  currentPage             : PropTypes.number,
  tag                     : PropTypes.string,
  documentType            : PropTypes.string,
  priority                : PropTypes.string,
  milestone               : PropTypes.string,
  owner                   : PropTypes.string,
};

function mapStateToProps(state) {
  return state.documentation.toJS();
}

function mapDispatchToProps(dispatch) {
  return {
    documentActions     : bindActionCreators(DocumentActions, dispatch),
    articleActions      : bindActionCreators(ArticleActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentPage);
