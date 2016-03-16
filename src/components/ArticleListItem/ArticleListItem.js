// Libraries
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import FlatButton from 'material-ui/lib/flat-button';

import HighlightMarkdown from '../../components/HighlightMarkdown/HighlightMarkdown';

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
      updatedAt
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
          <FlatButton
            label="Edit"
            primary={true}
            linkButton={true}
            href={`/main/articles/edit/${id}`} />
          <FlatButton
            label="Delete"/>
        </div>
        <br/>
        <HighlightMarkdown source={content} />
        {
          tags.map((tag, index) => {
            return (
              <span key={index}>
                <i className="fa fa-tag"/>&nbsp;{tag}&nbsp;
              </span>
            );
          })
        }

        <br />
        <br />
        <hr />
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
            {
              files.map((file, index) => {
                const MimeTypeIcon = {
                  'image/jpeg': 'fa-file-picture-o',
                  'video/mp4': 'fa-file-video-o'
                };

                return (
                  <span key={index}>
                    &nbsp;
                    <i className={`fa ${MimeTypeIcon[file.type]}`} />
                    &nbsp;
                    <a href="#" >{file.name}</a>
                  </span>
                );
              })
            }
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
  updatedAt       : PropTypes.number
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
