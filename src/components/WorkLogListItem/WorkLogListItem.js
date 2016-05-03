// Libraries
import React, { Component, PropTypes } from 'react';

import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';

import HighlightMarkdown from '../../components/HighlightMarkdown/HighlightMarkdown';
import ArticleTagList from '../../components/ArticleTagList/ArticleTagList';
import ArticleMetadata from '../../components/ArticleMetadata/ArticleMetadata';

// Styles
import './_WorkLogListItem.css';

const ABSTRACT_LINES = 10;

class WorkLogListItem extends Component {

  getContentAbstract() {
    const { content } = this.props;
    const splittedContent = content.split('\n') || [];
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
      updatedAt,
      onDelete,
      index,
      activeTag,
      onActiveTagChange
    } = this.props;
    const {
      abstractContent
    } = this.getContentAbstract();
    return (
      <Paper className="article-list-item">
          <h3 className="title">{title}</h3>
        <div className="button-group">
            <RaisedButton
              label="Edit"
              primary={true} />
          <RaisedButton
            label="Delete"
            onClick={onDelete.bind(this, id, index)} />
        </div>
        <HighlightMarkdown source={abstractContent}/>
        <hr />
        <ArticleMetadata
          author={author}
          updatedAt={updatedAt}
        />
        <br />
        <ArticleTagList
          tags={tags}
          value={activeTag}
          onChange={onActiveTagChange}
        />
      </Paper>
    );
  }
}


WorkLogListItem.propTypes = {
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


WorkLogListItem.defaultProps = {
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

export default WorkLogListItem;
