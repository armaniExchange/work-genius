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
      fetchDocumentCategories,
      fetchAllTags,
      fetchAllUsers,
      fetchAllMilestones
    } = this.props.documentActions;

    // Todo: find a better way to handle jumpling this page from other page
    fetchDocumentCategories();
    fetchAllTags();
    fetchAllUsers();
    fetchAllMilestones();
    this.queryArticles();
  }

  // fetch articles with query
  onTagChange(tag) {
    this.props.documentActions.updateArticlesQuery({tag, currentPage: 1});
    setTimeout(() => this.queryArticles(), 0);
  }

  onFilterChange(filter) {
    this.props.documentActions.updateArticlesQuery(Object.assign(filter, {currentPage: 1}));
    setTimeout(() => this.queryArticles(), 0);
  }

  onPaginate(page) {
    this.props.documentActions.updateArticlesQuery({currentPage: page});
    setTimeout(() => this.queryArticles(), 0);
  }

  resetQueryAndFetchArticles() {
    this.props.documentActions.updateArticlesQuery({
      currentPage: 1,
      tag: '',
      documentType: '',
      priority: '',
      milestone: '',
      owner: '',
      categoryId: ''
    });
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
      categoryId
    } = this.props;
    let query = {
      page: currentPage,
      tag: tag,
      authorId: owner,
      documentType,
      priority,
      milestone,
      categoryId
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

  onConfirmDeleteArticle() {
    this.props.articleActions.deleteArticle(this.state.editingArticle.id);
  }

  onArticleDelete(id) {
    this.setState({
      isConfirmDeleteArticleDialogVisible: true,
      editingArticle: { id }
    });
  }

  onCancelDeleteArticle() {}

  _onNodeClick(item) {
    this.props.documentActions.setSelectedCategory({...item, isLeaf: false});
  }

  _setAndFetchCategory(item) {
    const { documentActions } = this.props;
    documentActions.setSelectedCategory({...item, isLeaf: true});
    this.props.documentActions.updateArticlesQuery({
      categoryId: item.id || '',
      currentPage: 1
    });
    setTimeout(() => this.queryArticles(), 0);
  }

  _clearCategory() {
    this._setAndFetchCategory({});
  }

  renderArticleList() {
    const {
      articleList,
      tag
    } = this.props;
    if (articleList.length === 0) {
      return (
        <div className="blank-article">
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
            activeTag={tag}
            onDelete={::this.onArticleDelete}
            onActiveTagChange={::this.onTagChange}
            {...article}/>
        );
      })
    );
  }

  render() {
    const PAGE_SIZE = 20;
    const {
      allUsers,
      allMilestones,
      allTags,
      documentCategories,
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
                label="+ Create Document"
                secondary={true} />
            </Link>
            <h5>HOT TAGS</h5>
            <ArticleTagList
              onChange={::this.onTagChange}
              tags={allTags}
              value={tag} />
            <div className="knowledge-tree-label">
              <h5>KNOWLEDGE TREE</h5>
              <Link to="/main/knowledge/document/category/edit">
                <i className="fa fa-pencil" ariaHidden="true" />
              </Link>
            </div>
            <CategoryTree
              data={documentCategories}
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
              onClearAll={::this.resetQueryAndFetchArticles}
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
  documentCategories      : PropTypes.object,
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
  categoryId              : PropTypes.string,
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
