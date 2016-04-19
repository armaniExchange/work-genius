// Libraries
import React, { Component } from 'react';
import Select from 'react-select';

// Styles
import './_ArticleMilestoneSelect.css';

class ArticleMilestoneSelect extends Component {
  render() {
    return (
      <div style={{marginTop: 28, position: 'relative'}}>
        <label style={{
          position: 'absolute',
          fontSize: 12,
          marginTop: -14,
          color: '#999'
        }}>
          Milestone
        </label>
        <Select
          {...this.props}
          allowCreate={true}
          placeholder=" "
        />
      </div>
    );
  }
}

export default ArticleMilestoneSelect;
