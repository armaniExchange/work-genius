// Style
import './_DocumentPage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import RaisedButton from 'material-ui/lib/raised-button';
import Breadcrumb from '../../components/A10-UI/Breadcrumb';
import BREADCRUMB from '../../constants/breadcrumb';

import ArticleListItem from '../../components/ArticleListItem/ArticleListItem';
import ArticleTagList from '../../components/ArticleTagList/ArticleTagList';
import CategoryTree from '../../components/CategoryTree/CategoryTree';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog/ConfirmDeleteDialog';
import Pagination from 'rc-pagination';

import * as DocumentActions from '../../actions/document-page-actions';
import * as ArticleActions from '../../actions/article-page-actions';

class DocumentPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      isConfirmDeleteArticleDialogVisible: false,
      editingArticle: null
    };
  }

  componentWillMount() {
    const {
      fetchArticles,
      fetchAllCategories,
      fetchAllTags
    } = this.props.documentActions;

    // Todo: find a better way to handle jumpling this page from other page
    fetchAllCategories();
    fetchAllTags();
    if (this.props.articleList.length === 0) {
      fetchArticles();
    }
  }

  queryWithTag(tag) {
    this.props.documentActions.fetchArticles({tag});
  }

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

  onCancelDeleteArticle() {

  }

  onPaginate(page) {
    this.setState({
      currentPage: page
    });
    this.props.documentActions.fetchArticles({
      page
    });
  }

  render() {
    const leftPanelStyle = {
      width: '30%',
      float: 'left'
    };
    const rightPanelStyle = {
      width: '70%',
      float: 'left'
    };
    const {
      articleList,
      allTags,
      allCategories,
      articleTotalCount
    } = this.props;
    const {
      isConfirmDeleteArticleDialogVisible,
      editingArticle,
      currentPage
    } = this.state;

    return (
      <section>
        <Breadcrumb data={BREADCRUMB.document} />
        <div style={leftPanelStyle}>
          <Link to="/main/knowledge/document/edit/new">
            <RaisedButton
              label="+ Create a Document"
              secondary={true} />
          </Link>
          <h5>Hot tags</h5>
          <ArticleTagList
            tags={allTags}
            onClick={::this.queryWithTag} />
          <div>
            <h5>Tree</h5>
            <CategoryTree data={allCategories} />
          </div>
        </div>
        <div style={rightPanelStyle}>
          {
            articleList.map((article, index) => {
              return (
                <ArticleListItem
                  key={index}
                  index={index}
                  onDelete={::this.onArticleDelete}
                  {...article}/>
              );
            })
          }
          <Pagination
            onChange={::this.onPaginate}
            pageSize={5}
            current={currentPage}
            total={articleTotalCount} />
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
  articleList            : PropTypes.array,
  articleTotalCount      : PropTypes.number,
  allCategories          : PropTypes.object,
  allTags                : PropTypes.array,
  documentActions        : PropTypes.object.isRequired,
  articleActions         : PropTypes.object.isRequired
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
