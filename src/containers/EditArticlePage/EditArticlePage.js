// Style
import './_EditArticlePage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RaisedButton from 'material-ui/lib/raised-button';

import HighlightMarkdown from '../../components/HighlightMarkdown/HighlightMarkdown';
import ArticleEditor from '../../components/ArticleEditor/ArticleEditor';

import * as ArticleActions from '../../actions/article-page-actions';
import * as DocumentActions from '../../actions/document-page-actions';

class EditArticlePage extends Component {

  constructor(props) {
    super(props);
    this.state = this.getEditingStateFromProps(props);
    this.state.isPreviewVisible = false;
  }

  componentWillMount() {
    const {
      articleActions,
      params,
      documentActions
    } = this.props;

    if (!this.isCreate()) {
      articleActions.fetchArticle(params.articleId);
    }
    documentActions.fetchAllCategories();
    documentActions.fetchAllTags();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isEditing && !nextProps.isEditing) {
      this.props.history.replace(`/main/knowledge/document/${nextProps.id}`);
    }
    if (this.props.id === nextProps.id && this.props.files.length !== nextProps.files.lengh) {
      // fiile upload change files, but skip to set new state
    } else {
      const newState = this.getEditingStateFromProps(nextProps);
      this.setState(newState);
    }
  }

  componentWillUnmount() {
    this.props.articleActions.clearArticle();
  }

  isCreate() {
    return this.props.params.articleId === 'new';
  }

  getEditingStateFromProps(props) {
    const {
      title,
      content,
      tags,
      category
    } = props;

    return {
      editingTitle: title,
      editingContent: content,
      editingTags: tags,
      editingCategory: category
    };
  }

  togglePreviewVisible() {
    this.setState({
      isPreviewVisible: !this.state.isPreviewVisible
    });
  }

  onContentChange(newContent) {
    this.setState({ editingContent: newContent});
  }

  onTitleChange(event){
    this.setState({
      editingTitle: event.target.value
    });
  }

  onTagsChange(val, tags) {
    this.setState({
      editingTags: tags.map(tag => tag.value)
    });
  }

  onCategoryChange(path) {
    this.setState({
      editingCategory: {id: path}
    });
  }

  onFileUpload(file) {
    const { id, files } = this.props;
    this.props.articleActions.uploadArticleFile({
      articleId: id,
      file,
      files
    });
  }

  onFileRemove(file) {
    const { id, files } = this.props;
    this.props.articleActions.removeArticleFile({
      articleId: id,
      file,
      files
    });
  }

  onCancel() {
    this.props.history.go(-1);
  }

  _transformToOptions(categories) {
    return this._transformFromTree(categories).filter((item) => {
      return item.path !== 'root';
    }).map((item) => ({
      label: item.path.replace('root/', '').replace(/\//gi, ' > '),
      value: item.path
    }));
  }
  
  _transformFromTree(categories) {
    if (!categories || typeof categories !== 'object' || Array.isArray(categories)) {
      return [];
    }
    if (!categories.children || categories.children.length === 0) {
      return [categories];
    }
    let rest = categories.children.reduce((result, next) => {
      return result.concat(this._transformFromTree(next));
    }, []);
    return [{path: categories.path}, ...rest];
  }

  onSubmit() {
    const {
      files,
      params,
      articleActions
    } = this.props;
    const {
      editingTitle,
      editingTags,
      editingCategory,
      editingContent
    } = this.state;
    const {
      createArticle,
      updateArticle
    } = articleActions;
    const postArticle = this.isCreate() ? createArticle : updateArticle;
    const idField = this.isCreate() ? null : {id: params.articleId};
    postArticle(Object.assign({
      title: editingTitle,
      tags: editingTags,
      category: editingCategory,
      content: editingContent,
      files: files.map(file => {return {id: file.id};})
    }, idField));
  }

  render() {
    const {
      editingContent,
      editingTitle,
      editingTags,
      editingCategory,
      isPreviewVisible
    } = this.state;

    const {
      params,
      files,
      allCategories,
      allTags
    } = this.props;

    const editorStyle = {
      width: isPreviewVisible ? '50%' : '100%',
      float: 'left',
      paddingRight: 10
    };

    const previewStyle = {
      width: '50%',
      float: 'left',
      borderRadius: 5,
      border: '1px solid lightgray',
      background: 'white',
      padding: 15,
      overflowX: 'scroll'
    };

    const pageTitle = params.articleId === 'new' ?
      'Create Document' : 'Update Document';

    return (
      <section>
        <h3>{pageTitle}</h3>
        <div style={editorStyle}>
          <ArticleEditor
            title={editingTitle}
            tags={editingTags}
            content={editingContent}
            category={editingCategory}
            files={files}
            tagSuggestions={allTags}
            allCategoriesOptions={::this._transformToOptions(allCategories)}
            onTagsChange={::this.onTagsChange}
            onTitleChange={::this.onTitleChange}
            onCategoryChange={::this.onCategoryChange}
            onContentChange={::this.onContentChange}
            onFileUpload={::this.onFileUpload}
            onFileRemove={::this.onFileRemove}/>
        </div>
        {
          isPreviewVisible ? (
            <div style={previewStyle}>
              <HighlightMarkdown source={editingContent} />
            </div>
          ) : null
        }
        <div style={{clear: 'both'}}/>
        <br />
        <RaisedButton
          label="Submit"
          primary={true}
          onClick={::this.onSubmit}
          style={{margin: 10}} />
        <RaisedButton
          label="Cancel"
          onClick={::this.onCancel}
          style={{margin: 10}} />
        <RaisedButton
          label="Preview"
          secondary={true}
          onClick={::this.togglePreviewVisible}
          style={{margin: 10, float: 'right'}} />
      </section>
    );
  }
}

EditArticlePage.propTypes = {
  id                  : PropTypes.string,
  title               : PropTypes.string,
  author              : PropTypes.shape({id: PropTypes.string, name: PropTypes.string}),
  tags                : PropTypes.arrayOf(PropTypes.string),
  files               : PropTypes.array,
  category            : PropTypes.object,
  comments            : PropTypes.array,
  content             : PropTypes.string,
  createdAt           : PropTypes.number,
  updatedAt           : PropTypes.number,
  params              : PropTypes.object,
  allCategories       : PropTypes.object,
  allTags             : PropTypes.arrayOf(PropTypes.string),
  isEditing           : PropTypes.bool,
  articleActions      : PropTypes.object.isRequired,
  documentActions     : PropTypes.object.isRequired,
  history             : PropTypes.object
};

EditArticlePage.defaultProps = {
  id                  : '',
  content             : '',
  author              : { id: '', name: ''},
  tags                : [],
  files               : [],
  comments            : [],
  content             : '',
  createdAt           : 0,
  updatedAt           : 0,
  allCategories       : {}
};

function mapStateToProps(state) {
  const {
    allCategories,
    allTags
  } = state.documentation.toJS();

  return Object.assign({}, state.article.toJS(), {
    allCategories,
    allTags
  });
}

function mapDispatchToProps(dispatch) {
  return {
    articleActions      : bindActionCreators(ArticleActions, dispatch),
    documentActions     : bindActionCreators(DocumentActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditArticlePage);
