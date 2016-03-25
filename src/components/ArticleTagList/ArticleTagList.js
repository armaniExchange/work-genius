// Libraries
import React, { Component, PropTypes } from 'react';

// Styles
import './_ArticleTagList.css';

class ArticleTagList extends Component {

  onClick(tag) {
    const {onClick} = this.props;
    if (onClick) {
      onClick(tag);
    }
  }

  render() {
    const {tags} = this.props;

    return (
      <span className="component-article-tag-list">
        {
          (tags || []).map((tag, index) => {
            return (
              <span
                className="tag"
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
  onClick        : PropTypes.func
};


ArticleTagList.defaultProps = {
  tags           : []
};

export default ArticleTagList;
