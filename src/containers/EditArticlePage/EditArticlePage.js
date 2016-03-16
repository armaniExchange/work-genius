// Style
import './_EditArticlePage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Markdown from 'react-markdown';
import RaisedButton from 'material-ui/lib/raised-button';

import ArticleEditor from '../../components/ArticleEditor/ArticleEditor';

import * as ArticleActions from '../../actions/article-page-actions';

class EditArticlePage extends Component {

  constructor(props) {
    super(props);
    this.state = this.getEditingStateFromProps(props);
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
    const newState = this.getEditingStateFromProps(nextProps);
    this.setState(newState);
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

  onContentChange(newContent) {
    this.setState({ editingContent: newContent});
  }

  onTitleChange(event){
    this.setState({
      editingTitle: event.target.value
    });
  }

  onTagsChange(event) {
    this.setState({
      editingTags: event.target.value.replace(' ','').split(',')
    });
  }

  onCategoryChange(event) {
    this.setState({
      editingCategory: event.target.value
    });
  }

  onFileUpload(dataUri) {
    this.props.articleActions.uploadArticleFile(dataUri);
  }

  onSubmit() {
    const {
      editingTitle,
      editingTags,
      editingCategory,
      editingContent
    } = this.state;

    this.props.articleActions.updateArticle({
      title: editingTitle,
      tags: editingTags,
      category: editingCategory,
      content: editingContent
    });
  }

  render() {
    const previewStyle = {
      width: '49%',
      float: 'left',
      padding: '0 10px',
      borderLeft: '1px solid gray'
    };
    const editorContentStyle = {
      padding: '0 10px',
      width: '49%',
      float: 'left'
    };

    const {
      editingContent,
      editingTitle,
      editingTags,
      editingCategory
    } = this.state;

    const pageTitle = this.props.params.articleId === 'new' ?
      'Create Document' : 'Update Document';

    return (
      <section>
        <div>
          <h3>{pageTitle}</h3>
          <div style={editorContentStyle}>
            <ArticleEditor
              title={editingTitle}
              tags={editingTags}
              content={editingContent}
              category={editingCategory}
              onTagsChange={::this.onTagsChange}
              onTitleChange={::this.onTitleChange}
              onCategoryChange={::this.onCategoryChange}
              onContentChange={::this.onContentChange}
              onFileUpload={::this.onFileUpload}/>
          </div>
          <div style={previewStyle}>
            <h3>Preview</h3>
            <Markdown source={editingContent} />
          </div>
          <div style={{clear: 'both'}}/>
          <br />
          <RaisedButton
            label="Submit"
            primary={true}
            onClick={::this.onSubmit}
            style={{margin: 10}} />
          <RaisedButton
            label="Preview"
            style={{margin: 10}} />
        </div>
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
  comments            : PropTypes.array,
  content             : PropTypes.string,
  createdAt           : PropTypes.number,
  updatedAt           : PropTypes.number,
  params              : PropTypes.object,
  articleActions      : PropTypes.object.isRequired
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
  updatedAt           : 0
};

function mapStateToProps(state) {
  return state.article.toJS();
}

function mapDispatchToProps(dispatch) {
  return {
    articleActions: bindActionCreators(ArticleActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditArticlePage);
