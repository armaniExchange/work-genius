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
      this.props.onTagsChange([...tags, tag]);
  }

  handleTagDrag() {}

  render() {
    const {
      tags,
      suggestions
    } = this.props;
    const filteredSuggestions = suggestions.filter(suggestion => {
      return tags.indexOf(suggestion) === -1;
    });

    return (
     <ReactTags
      {...this.props}
      suggestions={filteredSuggestions}
      tags={tags.map(tag => {
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
  suggestions     : PropTypes.arrayOf(PropTypes.string),
  onTagsChange    : PropTypes.func.isRequired
};


TagsInput.defaultProps = {
  tags           : []
};

export default TagsInput;
