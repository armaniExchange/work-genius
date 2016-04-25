// Libraries
import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import ArticleFileList from '../../components/ArticleFileList/ArticleFileList';
// Styles
import './_ArticleMetadata.css';

class ArticleMetadata extends Component {

  render() {
    const {
      author,
      updatedAt,
      comments,
      files
    } = this.props;

    return (
      <div className="article-metadata">
        <span>Author: {author && author.name}&nbsp;&nbsp;&nbsp;</span>
        <span style={{color: 'gray'}}>
          {moment(updatedAt).format('YYYY-MM-DD')}&nbsp; &nbsp;&nbsp;
        </span>

        {
          comments.length !== 0 ? (
            <span>
              <i className="fa fa-comments"/>&nbsp;
              Comments: {comments.length}&nbsp;&nbsp;&nbsp;
            </span>
          ) : null
        }
        {
          files.length !== 0 ? (
            <span>
              <i className="fa fa-paperclip"/>&nbsp;
              <span>{`attachments(${files.length}):`}&nbsp;</span>
              <ArticleFileList files={files} />
            </span>
          ) : null
        }

      </div>
    );
  }
}


ArticleMetadata.propTypes = {
  author    : PropTypes.object,
  updatedAt : PropTypes.number,
  files     : PropTypes.array,
  comments  : PropTypes.array,
};


ArticleMetadata.defaultProps = {
  author   : { id: '', name: ''},
  files    : [],
  comments : [],
};

export default ArticleMetadata;
