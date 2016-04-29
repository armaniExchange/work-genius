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
    this.state = Object.assign(this.getEditingStateFromProps(props), {
      isPreviewVisible: false,
      isArticleFormValid: false,
      enableErrorMessage: false,
      isContentFromTemplate: false
    });
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
    documentActions.fetchDocumentCategories();
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

    if (this.props.id === nextProps.id && thisFiles.length !== nextFiles.length) {
      // fiile upload change files, but skip to set new state
    } else {
      // const newState = this.getEditingStateFromProps(nextProps);
      // this.setState(newState);
    }
    const documentTemplateContent = nextProps.documentTemplate.content;
    if (this.state.isContentFromTemplate || (!this.state.editingContent && documentTemplateContent)) {
      this.setState({
        editingContent: documentTemplateContent,
        isContentFromTemplate: true
      });
    }
  }

  componentWillUnmount() {
    this.props.articleActions.clearArticle();
  }

  isCreate() {
    return this.props.params.articleId === 'new';
  }

  ValidateForm(){
    const {
      editingTitle,
      editingCategoryId,
      editingContent
    } = this.state;
    const isValid = !!editingTitle.trim() && !!editingCategoryId && !!editingContent.trim();
    this.setState({
      isArticleFormValid: isValid
    });
  }

  getEditingStateFromProps(props) {
    const {
      title,
      content,
      tags,
      categoryId,
      documentType,
      priority,
      milestone,
      reportTo
    } = props;

    return {
      editingTitle: title,
      editingContent: content,
      editingTags: tags,
      editingCategoryId: categoryId,
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
    this.setState({ editingContent: newContent }, () => {
      ::this.ValidateForm();
    });
  }

  onTitleChange(event){
    this.setState({ editingTitle: event.target.value }, () => {
      ::this.ValidateForm();
    });
  }

  onTagsChange(val, tags) {
    this.setState({
      editingTags: tags.map(tag => tag.value)
    });
  }

  onCategoryIdChange(id) {
    this.setState({ editingCategoryId: id }, () => {
      ::this.ValidateForm();
    });
  }

  onDocumentTypeChange(event, index, value) {
    this.setState({ editingDocumentType: value }, ()=> {
      const {
        editingContent,
        editingDocumentType,
        isContentFromTemplate
      } = this.state;
      if (editingContent.trim() === '' || isContentFromTemplate) {
        this.props.articleActions.fetchDocumentTemplate(editingDocumentType);
      }
    });
  }

  onPriorityChange(event, index, value) {
    this.setState({ editingPriority: value });
  }

  onMilestoneChange(value) {
    this.setState({ editingMilestone: value });
  }

  onReportToChange(val, items) {
    this.setState({ editingReportTo: items.map(item => item.value) });
  }

  onFileUpload(file) {
    const { id, files } = this.props;
    const mdImageSymbol = file.type.includes('image') ? '!' : '';
    this.setState({
      editingContent: this.refs.articleEditor.getValueOfInsertedStringAtCursor(`\n${mdImageSymbol}${this.getUploadingFileMarkdown(file)}`)
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
    return `[Uploading ${file.name} ...]()`;
  }
  _transformToOptions(categories) {
    return this._transformFromTree(categories).filter((item) => {
      return item.path !== 'root';
    }).map((item) => ({
      label: item.path ? item.path.replace('root/', '').replace(/\//gi, ' > ') : '',
      value: item.id
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

  onDocumentTemplateUpdate(documentTemplate) {
    this.props.articleActions.updateDocumentTemplate(documentTemplate);
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
      editingCategoryId,
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
      categoryId: editingCategoryId,
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
      editingCategoryId,
      editingDocumentType,
      editingPriority,
      editingMilestone,
      editingReportTo,
      isPreviewVisible,
      isArticleFormValid
    } = this.state;

    const {
      params,
      files,
      documentCategories,
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
            ref="articleEditor"
            title={editingTitle}
            tags={editingTags}
            content={editingContent}
            categoryId={editingCategoryId}
            files={files}
            tagSuggestions={allTags}
            allCategoriesOptions={::this._transformToOptions(documentCategories)}
            documentType={editingDocumentType}
            priority={editingPriority}
            milestone={editingMilestone}
            reportTo={editingReportTo}
            onTagsChange={::this.onTagsChange}
            onTitleChange={::this.onTitleChange}
            onCategoryIdChange={::this.onCategoryIdChange}
            onContentChange={::this.onContentChange}
            onFileUpload={::this.onFileUpload}
            onFileRemove={::this.onFileRemove}
            onDocumentTypeChange={::this.onDocumentTypeChange}
            onPriorityChange={::this.onPriorityChange}
            onMilestoneChange={::this.onMilestoneChange}
            onReportToChange={::this.onReportToChange}
            onDocumentTemplateUpdate={::this.onDocumentTemplateUpdate}
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
          disabled={!isArticleFormValid}
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
  id                 : PropTypes.string,
  title              : PropTypes.string,
  author             : PropTypes.shape({id: PropTypes.string, name: PropTypes.string}),
  tags               : PropTypes.arrayOf(PropTypes.string),
  files              : PropTypes.array,
  categoryId         : PropTypes.string,
  comments           : PropTypes.array,
  content            : PropTypes.string,
  documentType       : PropTypes.string,
  priority           : PropTypes.string,
  milestone          : PropTypes.string,
  reportTo           : PropTypes.arrayOf(PropTypes.string),
  createdAt          : PropTypes.number,
  updatedAt          : PropTypes.number,
  params             : PropTypes.object,
  documentCategories : PropTypes.object,
  allTags            : PropTypes.arrayOf(PropTypes.string),
  isEditing          : PropTypes.bool,
  articleActions     : PropTypes.object.isRequired,
  documentActions    : PropTypes.object.isRequired,
  history            : PropTypes.object,
  documentTemplate   : PropTypes.object
};

EditArticlePage.defaultProps = {
  id                 : '',
  content            : '',
  author             : { id: '', name: ''},
  tags               : [],
  files              : [],
  comments           : [],
  content            : '',
  createdAt          : 0,
  updatedAt          : 0,
  documentCategories : {},
  documentTemplate   : {}
};

function mapStateToProps(state) {
  const {
    documentCategories,
    allTags,
  } = state.documentation.toJS();
  const documentTemplate = state.documentTemplate.toJS();
  return Object.assign({}, state.article.toJS(), {
    documentCategories,
    allTags,
    documentTemplate
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
