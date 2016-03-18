// Libraries
import React, { Component, PropTypes } from 'react';
import Markdown from 'react-markdown';
import moment from 'moment';

// Styles
import './_ArticleListItem.css';

class ArticleListItem extends Component {
  render() {
    const {
      id,
      title,
      author,
      tags,
      // files,
      content,
      // createdAt,
      updatedAt
    } = this.props;
    const style = {
      background: 'white',
      padding: 15,
      margin: '15px 0',
      border: 3,
      boxShadow: '0 2px lightgray'
    };
    return (
      <div style={style}>
        <a href={`/main/articles/${id}`}>
          <h3 style={{margin: 0}}>{title}</h3>
        </a>
        <span style={{color: 'gray'}}>
          {moment(updatedAt).format('MMM Do YY')}
        </span>
        <span>&nbsp;|&nbsp;</span>
        <span>{author.name}</span>
        <br/>
        <Markdown source={content} />
        {
          tags.map((tag, index) => {
            return (
              <span key={index}>
                <i className="fa fa-tag"/>&nbsp;{tag}&nbsp;
              </span>
            );
          })
        }
        <a href={`/main/articles/edit/${id}`}>
          <i className="fa fa-pencil" />
          Edit
        </a>
        <br />
        <a href="#">
          >>&nbsp;Read More
        </a>
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
