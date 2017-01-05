// Style
import './_ViewArticlePage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Paper from 'material-ui/lib/paper';
import Helmet from 'react-helmet';
import SelectField from 'material-ui/lib/SelectField';
import MenuItem from 'material-ui/lib/menus/menu-item';

import HighlightMarkdown from '../../components/HighlightMarkdown/HighlightMarkdown';
import ArticleToolbar from '../../components/ArticleToolbar/ArticleToolbar';
import ArticleTagList from '../../components/ArticleTagList/ArticleTagList';
import CommentEditor from '../../components/CommentEditor/CommentEditor';
import CommentListItem from '../../components/CommentListItem/CommentListItem';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog/ConfirmDeleteDialog';
import ArticleMetadata from '../../components/ArticleMetadata/ArticleMetadata';

import * as ArticleActions from '../../actions/article-page-actions';

class ViewArticlePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isConfirmDeleteArticleDialogVisible: false,
      isConfirmDeleteCommentDialogVisible: false,
      deletingCommentId: null,
      editingBugStatus: null
    };
  }

  componentWillMount() {
    const {
      params,
      articleActions
    } = this.props;
    if ( params.articleId !== 'new' ) {
      articleActions.fetchArticle(params.articleId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isDeleting && !nextProps.isDeleting) {
      this.props.history.replace('/main/knowledge/document');
    }
    this.setState({
      editingBugStatus: nextProps.bugStatus
    });
  }

  componentWillUnmount() {
    this.props.articleActions.clearArticle();
  }

  onConfirmDeleteArticleDialogRequestHide() {
    this.setState({
      isConfirmDeleteArticleDialogVisible: false,
    });
  }

  onConfirmDeleteArticle() {
    this.props.articleActions.deleteArticle(this.props.id);
  }

  onArticleDelete() {
    this.setState({
      isConfirmDeleteArticleDialogVisible: true,
    });
  }

  onCancelDeleteArticle() {

  }

  onCommentCreate(newCommentContent) {
    this.props.articleActions.createComment({
      articleId: this.props.id,
      comment: { content: newCommentContent }
    });
  }

  onCommentUpdate(updatedComment) {
    this.props.articleActions.updateComment({
      articleId: this.props.id,
      comment: updatedComment
    });
  }

  onConfirmDeleteCommentDialogRequestHide() {
    this.setState({
      isConfirmDeleteCommentDialogVisible: false,
      deletingCommentId: null
    });
  }

  onConfirmDeleteComment() {
    this.props.articleActions.deleteComment({
      id: this.state.deletingCommentId,
      articleId: this.props.id
    });
  }

  onCommentDelete(id) {
    this.setState({
      isConfirmDeleteCommentDialogVisible: true,
      deletingCommentId: id
    });
  }

  onCancelDeleteComment() {

  }

  onEditingBugStatus(event, index, value) {
    const {
      id,
      articleActions: { updateArticle }
    } = this.props;

    updateArticle({
      id,
      bugStatus: value
    });
    // this.setState({ editingBugStatus: value });
  }

  render() {
    const {
      id,
      author,
      files,
      title,
      content,
      tags,
      comments,
      updatedAt,
      currentUser,
      documentType,
      isDeleted
    } = this.props;
    const {
      editingBugStatus,
      isConfirmDeleteArticleDialogVisible,
      isConfirmDeleteCommentDialogVisible
    } = this.state;
    let documentTitle = 'KB Document - ' + title;
    return (
      <section className="view-article-page">
        <Helmet title={documentTitle} />
        <Paper className="header" zDepth={1}>
           <h3>{isDeleted ? <small>[DELETED]</small> : ''}{title}</h3>
          <hr />
          <ArticleMetadata
            author={author}
            updatedAt={updatedAt}
            comments={comments}
            files={files}
          />
          <ArticleTagList tags={tags} />
          <ArticleToolbar
            id={id}
            hideDelete={isDeleted}
            onDelete={::this.onArticleDelete}
          />
        </Paper>
        <Paper className="body" zDepth={1}>
          <HighlightMarkdown source={content} />
        </Paper>

        {
          documentType === 'bugs' && ([
            <h5 key="bug-title">Bug</h5>,
            <Paper key="bug-body" zDepth={1} className="bug">
              <SelectField
                // style={{position: 'absolute', right: 30, bottom: 10}}
                floatingLabelText="Bug Status"
                value={editingBugStatus}
                onChange={::this.onEditingBugStatus}
                autoWidth={false} >
                <MenuItem value="new" primaryText="new" />
                <MenuItem value="resolved" primaryText="resolved" />
                <MenuItem value="verified" primaryText="verified" />
                <MenuItem value="wontfix" primaryText="wontfix" />
                <MenuItem value="reopened" primaryText="reopened" />
              </SelectField>
            </Paper>
          ])
        }

        <h5>Comments</h5>
        {
          comments.map(comment => {
            return (
              <CommentListItem
                {...comment}
                key={comment && comment.id}
                currentUser={currentUser}
                onDeleteClick={::this.onCommentDelete}
                onSubmit={::this.onCommentUpdate}/>
            );
          })
        }
        <CommentEditor
          currentUser={currentUser}
          onSubmit={::this.onCommentCreate}
        />
        <ConfirmDeleteDialog
          open={isConfirmDeleteArticleDialogVisible}
          onConfirm={::this.onConfirmDeleteArticle}
          onCancel={::this.onCancelDeleteArticle}
          onRequestClose={::this.onConfirmDeleteArticleDialogRequestHide}
        />
        <ConfirmDeleteDialog
          open={isConfirmDeleteCommentDialogVisible}
          onConfirm={::this.onConfirmDeleteComment}
          onCancel={::this.onCancelDeleteComment}
          onRequestClose={::this.onConfirmDeleteCommentDialogRequestHide}
        />
      </section>
    );
  }
}

ViewArticlePage.propTypes = {
  id                  : PropTypes.string,
  title               : PropTypes.string,
  author              : PropTypes.shape({id: PropTypes.string, name: PropTypes.string}),
  tags                : PropTypes.arrayOf(PropTypes.string),
  documentType        : PropTypes.string,
  files               : PropTypes.array,
  comments            : PropTypes.array,
  content             : PropTypes.string,
  createdAt           : PropTypes.number,
  updatedAt           : PropTypes.number,
  params              : PropTypes.object,
  isDeleting          : PropTypes.bool,
  history             : PropTypes.object,
  currentUser         : PropTypes.object,
  articleActions      : PropTypes.object.isRequired,
  isDeleted           : PropTypes.bool,
};

ViewArticlePage.defaultProps = {
  id                  : '',
  content             : '',
  bugStatus           : 'new',
  author              : { id: '', name: ''},
  tags                : [],
  files               : [],
  comments            : [],
  content             : '',
  createdAt           : 0,
  updatedAt           : 0,
  isDeleted           : false
};

function mapStateToProps(state) {
  return Object.assign({}, state.article.toJS(), {
    currentUser: state.app.toJS().currentUser
  });
}

function mapDispatchToProps(dispatch) {
  return {
    articleActions: bindActionCreators(ArticleActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewArticlePage);
