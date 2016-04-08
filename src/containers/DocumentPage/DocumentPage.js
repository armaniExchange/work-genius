// Style
import './_DocumentPage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

import ArticleListItem from '../../components/ArticleListItem/ArticleListItem';
import ArticleTagList from '../../components/ArticleTagList/ArticleTagList';
import CategoryTree from '../../components/CategoryTree/CategoryTree';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog/ConfirmDeleteDialog';

import * as DocumentActions from '../../actions/document-page-actions';
import * as ArticleActions from '../../actions/article-page-actions';

class DocumentPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
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
    fetchArticles();
    fetchAllCategories();
    fetchAllTags();
  }


  onConfirmDeleteArticleDialogRequestHide() {
    this.setState({
      isConfirmDeleteArticleDialogVisible: false,
      editingArticle: null
    });
  }

  queryWithTag(tag) {
    this.props.documentActions.fetchArticles({tag});
  }

  onSearchChange(event) {
    this.props.documentActions.fetchArticles({
      q: event.target.value
    });
  }

  onConfirmDeleteArticle(deletingArticle) {
    // console.log(`delete article id:${deletingArticle.id} index:${deletingArticle.index}`);
    this.props.articleActions.deleteArticle(deletingArticle.id);
  }

  onCancelDeleteArticle() {

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
      allCategories
    } = this.props;
    const {
      isConfirmDeleteArticleDialogVisible,
      editingArticle
    } = this.state;

    return (
      <section>
        <div style={leftPanelStyle}>
          <Link to="/main/articles/edit/new">
            <RaisedButton
              label="+ Create a Document"
              secondary={true} />
          </Link>
          <br />
          <TextField
            hintText="Search..."
            onChange={::this.onSearchChange} />
          <br/>
          <ArticleTagList
            tags={allTags}
            onClick={::this.queryWithTag} />
          <div>
            <h5>Tree</h5>
            <CategoryTree categories={allCategories} />
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
  allCategories          : PropTypes.array,
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
