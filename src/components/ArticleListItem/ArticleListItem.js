// Libraries
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import Paper from 'material-ui/lib/paper';

import HighlightMarkdown from '../../components/HighlightMarkdown/HighlightMarkdown';
import ArticleTagList from '../../components/ArticleTagList/ArticleTagList';
import ArticleMetadata from '../../components/ArticleMetadata/ArticleMetadata';
import ArticleToolbar from '../../components/ArticleToolbar/ArticleToolbar';

// Styles
import './_ArticleListItem.css';

const ABSTRACT_LINES = 10;

class ArticleListItem extends Component {

  getContentAbstract() {
    const { content } = this.props;
    const firstHtmlTagPosition = content.search(/<[^>]+>/i);
    const splittedContent = firstHtmlTagPosition !== -1 ?
      content.slice(0, firstHtmlTagPosition).split('\n')
      : content.split('\n') || [];
    return {
      abstractContent: splittedContent.slice(0, ABSTRACT_LINES).join('\n'),
      readmore: splittedContent.length > ABSTRACT_LINES
    };
  }

  render() {
    const {
      id,
      title,
      author,
      tags,
      files,
      comments,
      updatedAt,
      onDelete,
      activeTag,
      onActiveTagChange
    } = this.props;
    const {
      abstractContent,
      readmore
    } = this.getContentAbstract();
    return (
      <Paper className="article-list-item">
        <Link to={`/main/knowledge/document/${id}`}>
          <h3 className="title">{title}</h3>
        </Link>
        <ArticleToolbar
          id={id}
          onDelete={onDelete}
        />
        <HighlightMarkdown source={abstractContent}/>
        {
          readmore ? (
            <div className="readmore">
              <Link to={`/main/knowledge/document/${id}`}>
                Read more >>
              </Link>
              <div />
            </div>
          ) : null
        }
        <hr />
        <ArticleMetadata
          author={author}
          updatedAt={updatedAt}
          comments={comments}
          files={files}
        />
        <ArticleTagList
          tags={tags}
          value={activeTag}
          onChange={onActiveTagChange}
        />
      </Paper>
    );
  }
}


ArticleListItem.propTypes = {
  id              : PropTypes.string,
  title           : PropTypes.string,
  author          : PropTypes.shape({id: PropTypes.string, name: PropTypes.string}),
  tags            : PropTypes.arrayOf(PropTypes.string),
  files           : PropTypes.array,
  comments        : PropTypes.array,
  content         : PropTypes.string,
  createdAt       : PropTypes.number,
  updatedAt       : PropTypes.number,
  index           : PropTypes.number,
  onDelete        : PropTypes.func.isRequired,
  activeTag       : PropTypes.string,
  onActiveTagChange     : PropTypes.func
};


ArticleListItem.defaultProps = {
  id              : '',
  title           : '',
  author          : {id: '', name: ''},
  tags            : [],
  files           : [],
  comments        : [],
  content         : '',
  createdAt       : 0,
  updatedAt       : 0
};

export default ArticleListItem;
