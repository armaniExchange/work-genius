// Style
import './_EditArticlePage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Markdown from 'react-markdown';
import Codemirror from 'react-codemirror';

import * as EditArticleAction from '../../actions/edit-article-page-actions';

import 'codemirror/mode/gfm/gfm';
import 'codemirror/lib/codemirror.css';
import 'react-tag-input/example/reactTags.css';

class EditArticlePage extends Component {

  constructor(props) {
    super(props);
    const {
      title,
      content,
      tags
    } = this.props;

    this.state = {
      editingTitle: title,
      editingContent: content,
      editingTags: tags,
    };
  }

  componentWillMount() {
    // const {
    //   id,
    //   editArticleActions
    // } = this.props;
    // editArticleActions.fetchArticle(id);
  }

  componentWillReceiveProps(nextProps) {
    const {
      title,
      content,
      tags,
    } = nextProps;
    this.setState({
      editingTitle: title,
      editingContent: content,
      editingTags: tags
    });
  }

  handleTagDelete(i) {
    let editingTags = this.state.editingTags;
    editingTags.splice(i, 1);
    this.setState({editingTags});
  }

  updateContent(newContent) {
    console.log('updateContent');
    this.setState({ editingContent: newContent});
  }

  handleTagAddition(tag) {
    let editingTags = this.state.editingTags;
    editingTags.push({
      id: editingTags.length + 1,
      text: tag
    });
    this.setState({editingTags});
  }
  handleTagDrag(tag, currPos, newPos) {
    let editingTags = this.state.editingTags;

    // mutate array
    editingTags.splice(currPos, 1);
    editingTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ editingTags });
  }

  onEditingTitleChange(newValue){
    this.setState({
      editingTitle: newValue
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
      // id,
      // title,
      // content,
      // tags,
      // author,
      // attachments,
    } = this.props;

    const {
      editingContent,
      editingTitle
    } = this.state;

    return (
      <section>
        <div>
          <div className="mdl-textfield mdl-js-textfield">
            <input className="mdl-textfield__input"
              type="text"
              id="articleTitle"
              value={editingTitle}
              onChange={::this.onEditingTitleChange}/>
            <label className="mdl-textfield__label" htmlFor="articleTitle">Title</label>
          </div>
          <div style={{float: 'right'}}>
            <button className="mdl-button mdl-js-button mdl-button--icon">
              <i className="fa fa-paperclip" />
            </button>
          </div>
          <div>
            <div style={editorContentStyle}>
              <Codemirror
                value={editingContent}
                onChange={::this.updateContent}
                options={{mode: 'gfm'}}/>
            </div>
            <div style={previewStyle}>
              <Markdown source={editingContent} />
            </div>
          </div>
          <div style={{clear: 'both'}}/>
          <br />
          <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
            Submit
          </button>
        </div>
      </section>
    );
  }
}

EditArticlePage.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  author: PropTypes.object,
  tags: PropTypes.array,
  attachments: PropTypes.array,
  comments: PropTypes.array,
  content: PropTypes.string,
  createdAt: PropTypes.number,
  updatedAt: PropTypes.number,
  editArticleActions: PropTypes.object.isRequired
};

EditArticlePage.defaultProps = {
  id: '',
  content: '',
  author: {
    id: '',
    name: '',
  },
  tags: [],
  attachments: [],
  comments: [],
  content: '',
  createdAt: 0,
  updatedAt: 0
};

function mapStateToProps(state) {
  return state.editArticle.toJS();
}

function mapDispatchToProps(dispatch) {
  return {
    editArticleActions: bindActionCreators(EditArticleAction, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditArticlePage);
