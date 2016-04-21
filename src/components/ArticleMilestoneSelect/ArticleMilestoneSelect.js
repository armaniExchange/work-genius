// Libraries
import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

// Styles
import './_ArticleMilestoneSelect.css';

class ArticleMilestoneSelect extends Component {
  render() {
    const {
      style,
      className
    } = this.props;
    const wrapperStyle = Object.assign({}, style, {
      marginTop: 28,
      position: 'relative'
    });
    return (
      <div style={wrapperStyle} className={className}>
        <label style={{
          position: 'absolute',
          fontSize: 12,
          marginTop: -14,
          color: '#999',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 700
        }}>
          Milestone
        </label>
        <Select
          {...this.props}
          className={{/*remove class name*/}}
          style={{/*remove style name*/}}
          allowCreate={true}
          placeholder=" "
        />
      </div>
    );
  }
}
ArticleMilestoneSelect.propTypes = {
  style     : PropTypes.object,
  className : PropTypes.string
};
export default ArticleMilestoneSelect;
