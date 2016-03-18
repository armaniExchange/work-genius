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
    const labelStyle = {
      margin: 2,
      padding: '2px 6px',
      background: 'darkblue',
      color: 'white',
      borderRadius: 3,
      display: 'inline-block',
      cursor: 'pointer'
    };

    return (
      <span>
        {
          tags.map((tag, index) => {
            return (
              <span
                key={index}
                style={labelStyle}
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
