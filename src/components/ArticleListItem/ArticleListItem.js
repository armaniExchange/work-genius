// Libraries
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';

import HighlightMarkdown from '../../components/HighlightMarkdown/HighlightMarkdown';
import ArticleTagList from '../../components/ArticleTagList/ArticleTagList';
import ArticleMetadata from '../../components/ArticleMetadata/ArticleMetadata';

// Styles
import './_ArticleListItem.css';

const ABSTRACT_LINES = 10;

class ArticleListItem extends Component {

  getContentAbstract() {
    const{ content } = this.props;
    return content.split('\n').slice(0, ABSTRACT_LINES).join('\n');
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
      index
    } = this.props;
    return (
      <Paper className="article-list-item">
        <Link to={`/main/knowledge/document/${id}`}>
          <h3 className="title">{title}</h3>
        </Link>
        <div className="button-group">
          <Link to={`/main/knowledge/document/edit/${id}`}>
            <RaisedButton
              label="Edit"
              primary={true} />
          </Link>
          <RaisedButton
            label="Delete"
            onClick={onDelete.bind(this, id, index)} />
        </div>
        <HighlightMarkdown source={::this.getContentAbstract()}/>
        <hr />
        <ArticleMetadata
          author={author}
          updatedAt={updatedAt}
          comments={comments}
          files={files}
        />
        <br />
        <ArticleTagList tags={tags} />
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
  onDelete        : PropTypes.func.isRequired
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
