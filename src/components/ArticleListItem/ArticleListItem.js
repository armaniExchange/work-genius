// Libraries
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';

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
      updatedAt,
      onDelete,
      index
    } = this.props;

    const paperStyle = {
      position: 'relative',
      padding: 15,
      marginBottom: 20,
    };

    return (
      <Paper style={paperStyle}>
        <Link to={`/main/knowledge/document/${id}`}>
          <h3 style={{margin: 0, minHeight: '1em'}}>{title}</h3>
        </Link>
        <div style={{
          position: 'absolute',
          top: 5,
          right: 5
        }}>
          <Link to={`/main/knowledge/document/edit/${id}`}>
            <RaisedButton
              style={{margin: 10}}
              label="Edit"
              primary={true} />
          </Link>
          <RaisedButton
            style={{margin: 10}}
            label="Delete"
            onClick={onDelete.bind(this, id, index)} />
        </div>
        <hr />
        <div>
          <span>Author: {author && author.name}&nbsp;</span>
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
            <i className="fa fa-paperclip"/>&nbsp;
            <span>{`attachments(${files.length}):`}&nbsp;</span>
            <ArticleFileList files={files} />
          </span>
        </div>
        <br />
        <ArticleTagList tags={tags} />
        <br/>
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
