// Libraries
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import FlatButton from 'material-ui/lib/flat-button';

import HighlightMarkdown from '../../components/HighlightMarkdown/HighlightMarkdown';
import ArticleFileList from '../../components/ArticleFileList/ArticleFileList';
import ArticleTagList from '../../components/ArticleTagList/ArticleTagList';

// Styles
import './_ArticleListItem.css';

class ArticleListItem extends Component {

  render() {
    const {
      id,
      title,
      author,
      tags,
      files,
      comments,
      content,
      // createdAt,
      updatedAt,
      onDelete,
      index
    } = this.props;

    const style = {
      background: 'white',
      padding: 15,
      margin: '15px 0',
      border: 3,
      boxShadow: '0 2px lightgray',
      position: 'relative'
    };

    return (
      <div style={style}>
        <a href={`/main/articles/${id}`}>
          <h3 style={{margin: 0}}>{title}</h3>
        </a>
        <div style={{
          position: 'absolute',
          top: 5,
          right: 5
        }}>
          <Link to={`/main/articles/edit/${id}`}>
            <FlatButton
              label="Edit"
              primary={true} />
          </Link>
          <FlatButton
            label="Delete"
            onDeleteClick={onDelete.bind(this, id, index)} />
        </div>
        <br/>
        <HighlightMarkdown source={content} />
        <br />
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
            <i className="fa fa-comments"/>&nbsp;
            Comments: {comments.length}&nbsp;
          </span>
          &nbsp;&nbsp;
          <span>
            <span>{`attachments(${files.length}):`}&nbsp;</span>
            <ArticleFileList files={files} />
          </span>
        </div>
        <br/>
      </div>
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
