// Libraries
import React, { Component, PropTypes } from 'react';
import {WithContext as ReactTags }from 'react-tag-input';;

// Styles
import './_TagsInput.css';


class TagsInput extends Component {

  handleTagDelete(i) {
    let tags = this.props.tags;
    tags.splice(i, 1);
    this.props.onTagsChange(tags);
  }

  handleTagAddition(tag) {
      let tags = this.props.tags;
      const sameNameTags = tags.filter(eachTag => {
        return eachTag === tag;
      });
      if (sameNameTags.length > 0) {
        return;
      }
      this.props.onTagsChange({tags: [...tags, tag]});
  }

  handleTagDrag() {}

  render() {
    const {
      tags
    } = this.props;

    return (
     <ReactTags tags={tags.map(tag => {
        return {
          id: tag,
          text: tag
        };
      })}
      handleDelete={::this.handleTagDelete}
      handleAddition={::this.handleTagAddition}
      handleDrag={::this.handleTagDrag} />
    );
  }
}

TagsInput.propTypes = {
  tags            : PropTypes.array,
  onTagsChange    : PropTypes.func.isRequired
};


TagsInput.defaultProps = {
  tags           : []
};

export default TagsInput;
