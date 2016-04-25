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
      value
    } = this.props;

    return (
      <span className="article-tag-list">
        {
          (tags || []).map((tag, index) => {
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
      </span>
    );
  }
}


ArticleTagList.propTypes = {
  tags           : PropTypes.arrayOf(PropTypes.string),
  value          : PropTypes.string,
  onChange       : PropTypes.func
};


ArticleTagList.defaultProps = {
  tags           : [],
  value          : '',
  onChange       : () => {}
};

export default ArticleTagList;
