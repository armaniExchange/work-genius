 // Style
import './_EditArticlePage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RaisedButton from 'material-ui/lib/raised-button';
import { flatTree } from '../../libraries/tree';

import HighlightMarkdown from '../../components/HighlightMarkdown/HighlightMarkdown';
import ArticleEditor from '../../components/ArticleEditor/ArticleEditor';

import * as ArticleActions from '../../actions/article-page-actions';
import * as DocumentActions from '../../actions/document-page-actions';

const AUTO_SAVE_ARTICLE_INTERVAL_MS = 30000;

class EditArticlePage extends Component {

  constructor(props, context) {
    super(props);
    this.state = Object.assign(this.getEditingStateFromProps(props, context), {
      isPreviewVisible: false,
      isArticleFormValid: false,
      isContentFromTemplate: false,
      enableErrorMessage: false
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
    } else {
      this.startToAutoSaveArticle();
    }
    documentActions.fetchDocumentCategories();
    documentActions.fetchDocumentHotTags();
  }

  componentWillReceiveProps(nextProps) {

    if (!this.props.isLoaded && nextProps.isLoaded){
      // first time loaded
      const newState = this.getEditingStateFromProps(nextProps, this.context);
      this.setState(newState, () => {::this.ValidateForm();});
      this.startToAutoSaveArticle();
      return;
    }

    if (this.props.isEditing && !nextProps.isEditing) {
      const { query } = this.context.location;
      const articleId = this.props.id || 'new';
      this.deleteSavedArticleFromLocalStorage(articleId);
      if (query.prev_page) {
        this.props.history.push(query.prev_page);
      } else {
        this.props.history.replace(`/main/knowledge/document/${nextProps.id}`);
      }
      if (query.close_window) {
        window.close();
      }
      return;
    }

    // replace file url in content
    const thisFiles = this.props.files;
    const nextFiles = nextProps.files;
    const justUpdateFile = this.getJustUpdatedFile(thisFiles, nextFiles);
    const { editingContent } = this.state;
    if ( justUpdateFile && editingContent) {
      const { name, url } = justUpdateFile;
      this.setState({
        editingContent: editingContent.replace(this.getUploadingFileMarkdown(justUpdateFile), `[${name}](${url})`)
      });
    }

    // load template to content
    if (this.state.isContentFromTemplate || (this.props.documentTemplate.id !== nextProps.documentTemplate.id) ){
      this.setState({
        isContentFromTemplate: true,
        editingContent: nextProps.documentTemplate.content
      });
    }
  }

  componentWillUnmount() {
    this.props.articleActions.clearArticle();
    clearInterval(this.savetoLocalStorageId);
  }

  startToAutoSaveArticle() {
    setTimeout(()=>{
      this.loadArticleFromLocalStorage();
    }, 1);
    clearInterval(this.savetoLocalStorageId);
    this.savetoLocalStorageId = setInterval(this.saveArticleToLocalStorage.bind(this), AUTO_SAVE_ARTICLE_INTERVAL_MS);
  }

  loadArticleFromLocalStorage() {
    const { params:{ articleId } } = this.props;
    const savedArticle = JSON.parse(localStorage.getItem('article') || '{}');

    if (savedArticle[articleId] && confirm('Do you want to load previous status?')) {
      const {
        title,
        tags,
        categoryId,
        content,
        documentType,
        priority,
        milestone,
        reportTo
      } = savedArticle[articleId];
      this.setState({
        editingTitle: title,
        editingTags: tags,
        editingCategoryId: categoryId,
        editingContent: content,
        editingDocumentType: documentType,
        editingPriority: priority,
        editingMilestone: milestone,
        editingReportTo: reportTo,
      });
      this.ValidateForm();
    } else {
      this.deleteSavedArticleFromLocalStorage(articleId);
    }
  }

  saveArticleToLocalStorage() {
    console.log('auto saving...');
    const {
      files,
      params:{
        articleId
      }
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
    const savedArticle = JSON.parse(localStorage.getItem('article') || '{}');

    savedArticle[articleId] = {
      title: editingTitle,
      tags: editingTags,
      categoryId: editingCategoryId,
      content: editingContent,
      documentType: editingDocumentType || '',
      priority: editingPriority || '',
      milestone: editingMilestone || '',
      reportTo: editingReportTo,
      files: files.map(file => {return {id: file.id};})
    };
    localStorage.setItem('article', JSON.stringify(savedArticle));
  }

  deleteSavedArticleFromLocalStorage(articleId) {
    console.log('deleteSavedArticleFromLocalStorage');
    const savedArticle = JSON.parse(localStorage.getItem('article') || '{}');
    delete savedArticle[articleId];
    localStorage.setItem('article', JSON.stringify(savedArticle));
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

  getEditingStateFromProps(props, context) {
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
    const { query } = context.location;

    return {
      editingTitle: (query && query.title) || title, // for /main/knowledge/document/edit/new?title=abc&tags=t1,t2,t3&document_type=knowledges
      editingContent: content,
      editingTags: (query && query.tags && query.tags.split(',')) || tags,
      editingCategoryId: categoryId,
      editingDocumentType: (query && query.document_type) || documentType,
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
    this.setState({
      editingContent: newContent,
      isContentFromTemplate: false
    }, () => {
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
      if (isContentFromTemplate || editingContent.trim() === '' ) {
        this.props.articleActions.fetchDocumentTemplate(editingDocumentType);
      }
    });
  }

  onPriorityChange(event, index, value) {
    this.setState({ editingPriority: value });
  }

  onMilestoneChange(value) {
    if (typeof value === 'string' ) {
      value = value.trim();
    }
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
    const { query } = this.context.location;
    if (query.close_window) {
      window.close();
    } else {
      this.props.history.go(-1);
    }
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
    return flatTree(categories).filter((item) => item.path !== 'root')
      .map((item) => ({
        label: item.path ? item.path.replace('root/', '').replace(/\//gi, ' > ') : '',
        value: item.id
      }));
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
      documentHotTags,
      isDeleted
    } = this.props;

    const editorStyle = {
      width: isPreviewVisible ? '50%' : '100%',
    };

    const pageTitle = params.articleId === 'new' ?
      'Create Document' : 'Update Document';

    return (
      <section className="edit-article-page">
        <h3>{isDeleted ? <small>[DELETED]</small> : ''}{pageTitle}</h3>
        <div className="article-editor-wrapper" style={editorStyle}>
          <ArticleEditor
            ref="articleEditor"
            title={editingTitle}
            tags={editingTags}
            content={editingContent}
            categoryId={editingCategoryId}
            files={files}
            tagSuggestions={documentHotTags}
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

EditArticlePage.contextTypes = {
    location: PropTypes.object
};
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
  documentHotTags    : PropTypes.arrayOf(PropTypes.string),
  isEditing          : PropTypes.bool,
  isLoaded           : PropTypes.bool,
  articleActions     : PropTypes.object.isRequired,
  documentActions    : PropTypes.object.isRequired,
  history            : PropTypes.object,
  documentTemplate   : PropTypes.object,
  isDeleted          : PropTypes.bool
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
  documentTemplate   : {},
  isDeleted          : false
};

function mapStateToProps(state) {
  const {
    documentCategories,
    documentHotTags,
  } = state.documentation.toJS();
  const documentTemplate = state.documentTemplate.toJS();
  return Object.assign({}, state.article.toJS(), {
    documentCategories,
    documentHotTags,
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
