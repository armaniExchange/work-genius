// Libraries
import React, { Component, PropTypes } from 'react';

// Styles
import './_ArticleTagList.css';

class ArticleTagList extends Component {

  onClick(tag) {
    const {
      onChange,
      value
    } = this.props;
    onChange(value === tag ? '' : tag);
  }

  render() {
    const {
      tags,
      value,
      maxNum
    } = this.props;

    return (
      <span className="article-tag-list">
        {
          (maxNum ? tags.slice(0, maxNum) : tags || []).map((tag, index) => {
            return (
              <span
                className={`tag ${value === tag ? 'active': ''}`}
                key={index}
                onClick={this.onClick.bind(this, tag)}>
                {tag}
              </span>
            );
          })
        }
        {
          maxNum && tags.length > maxNum ? <span className="tag">...</span>: null
        }
      </span>
    );
  }
}


ArticleTagList.propTypes = {
  tags           : PropTypes.arrayOf(PropTypes.string),
  value          : PropTypes.string,
  maxNum         : PropTypes.number,
  onChange       : PropTypes.func
};


ArticleTagList.defaultProps = {
  tags           : [],
  value          : '',
  onChange       : () => {}
};

export default ArticleTagList;
