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
      return;
    }

    const thisFiles = this.props.files;
    const nextFiles = nextProps.files;
    const justUpdateFile = this.getJustUpdatedFile(thisFiles, nextFiles);
    if ( justUpdateFile ) {
      const { name, url } = justUpdateFile;
      this.setState({
        editingContent: this.state.editingContent.replace(this.getUploadingFileMarkdown(justUpdateFile), `[${name}](${url})`)
      });
    }

    if (this.props.id === nextProps.id && thisFiles.length !== nextFiles.lengh) {
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
      category,
      documentType,
      priority,
      milestone,
      reportTo
    } = props;

    return {
      editingTitle: title,
      editingContent: content,
      editingTags: tags,
      editingCategory: category,
      editingDocumentType: documentType,
      editingPriority: priority,
      editingMilestone: milestone,
      editingReportTo: reportTo
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

  onDocumentTypeChange(event, index, value) {
    this.setState({
      editingDocumentType:value
    });
  }

  onPriorityChange(event, index, value) {
    this.setState({
      editingPriority: value
    });
  }

  onMilestoneChange(value) {
    this.setState({
      editingMilestone: value
    });
  }

  onReportToChange(val, items) {
    this.setState({
      editingReportTo: items.map(item => item.value)
    });
  }

  onFileUpload(file) {
    const { id, files } = this.props;
    this.setState({
      editingContent: this.state.editingContent + '\n' + this.getUploadingFileMarkdown(file)
    });
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

  getJustUpdatedFile(thisFiles, nextFiles) {
    return nextFiles.filter(nextFile => {
      const thisFile = thisFiles.filter( eachFile => nextFile.tempId === eachFile.tempId )[0];
      return thisFiles.length
        && thisFile
        && thisFile.isUploading
        && !nextFile.isUploading;
    })[0];
  }

  getUploadingFileMarkdown(file) {
    const mdImageSymbol = file.type.includes('image') ? '!' : '';
    return `${mdImageSymbol}[Uploading ${file.name} ...]()`;
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
    return categories.children.reduce((result, next) => result.concat(this._transformFromTree(next)), []);
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
      editingContent,
      editingDocumentType,
      editingPriority,
      editingMilestone,
      editingReportTo,
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
      documentType: editingDocumentType || '',
      priority: editingPriority || '',
      milestone: editingMilestone || '',
      reportTo: editingReportTo,
      files: files.map(file => {return {id: file.id};})
    }, idField));
  }

  render() {
    const {
      editingContent,
      editingTitle,
      editingTags,
      editingCategory,
      editingDocumentType,
      editingPriority,
      editingMilestone,
      editingReportTo,
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
    };

    const pageTitle = params.articleId === 'new' ?
      'Create Document' : 'Update Document';

    return (
      <section className="edit-article-page">
        <h3>{pageTitle}</h3>
        <div className="article-editor-wrapper" style={editorStyle}>
          <ArticleEditor
            title={editingTitle}
            tags={editingTags}
            content={editingContent}
            category={editingCategory}
            files={files}
            tagSuggestions={allTags}
            allCategoriesOptions={::this._transformToOptions(allCategories)}
            documentType={editingDocumentType}
            priority={editingPriority}
            milestone={editingMilestone}
            reportTo={editingReportTo}
            onTagsChange={::this.onTagsChange}
            onTitleChange={::this.onTitleChange}
            onCategoryChange={::this.onCategoryChange}
            onContentChange={::this.onContentChange}
            onFileUpload={::this.onFileUpload}
            onFileRemove={::this.onFileRemove}
            onDocumentTypeChange={::this.onDocumentTypeChange}
            onPriorityChange={::this.onPriorityChange}
            onMilestoneChange={::this.onMilestoneChange}
            onReportToChange={::this.onReportToChange}
          />
        </div>
        {
          isPreviewVisible ? (
            <div className="article-editor-preview">
              <HighlightMarkdown source={editingContent} />
            </div>
          ) : null
        }
        <div style={{clear: 'both'}}/>
        <br />
        <RaisedButton
          label="Submit"
          primary={true}
          disabled={!editingTitle || !editingCategory}
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
  documentType        : PropTypes.string,
  priority            : PropTypes.string,
  milestone           : PropTypes.string,
  reportTo            : PropTypes.arrayOf(PropTypes.string),
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
