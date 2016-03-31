// Style
import './_ViewArticlePage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import HighlightMarkdown from '../../components/HighlightMarkdown/HighlightMarkdown';
import ArticleFileList from '../../components/ArticleFileList/ArticleFileList';
import ArticleTagList from '../../components/ArticleTagList/ArticleTagList';

import * as ArticleActions from '../../actions/article-page-actions';

class ViewArticlePage extends Component {

  componentWillMount() {
    console.log('componentWillMount');
    const {
      params,
      articleActions
    } = this.props;
    if ( params.articleId !== 'new' ) {
      articleActions.fetchArticle(params.articleId);
    }
  }

  render() {
    const {
      author,
      files,
      title,
      content,
      tags,
      updatedAt
    } = this.props;

    return (
      <section>
        <h3>{title}</h3>
        <hr />
        <ArticleTagList tags={tags} />
        <HighlightMarkdown source={content} />
        <hr />
        <ArticleTagList tags={tags} />
        <div>
          <span>Author: {author.name}&nbsp;</span>
          &nbsp;&nbsp;
          <span style={{color: 'gray'}}>
            {moment(updatedAt).format('YYYY-MM-DD')}&nbsp;
          </span>
          &nbsp;&nbsp;
          <span>
            <span>{`attachments(${files.length}):`}&nbsp;</span>
            <ArticleFileList files={files} />
          </span>
        </div>
      </section>
    );
  }
}

ViewArticlePage.propTypes = {
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

ViewArticlePage.defaultProps = {
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
)(ViewArticlePage);
