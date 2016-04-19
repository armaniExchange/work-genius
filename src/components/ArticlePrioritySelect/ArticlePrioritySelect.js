// Libraries
import React, { Component } from 'react';
import SelectField from 'material-ui/lib/SelectField';
import MenuItem from 'material-ui/lib/menus/menu-item';
// Styles
import './_ArticlePrioritySelect.css';

class ArticlePrioritySelect extends Component {

  render() {
    const priorityOptions = [
      'Blocker',
      'Critical',
      'Major',
      'Minor',
      'Trival'
    ];

    return (
      <SelectField
        {...this.props}
        floatingLabelText="Priority"
        autoWidth={false} >
        {priorityOptions.map((item, index) => {
          return(
            <MenuItem
             key={index}
             value={item.toLowerCase()}
             primaryText={item} />
          );
        })}
      </SelectField>
    );
  }
}

export default ArticlePrioritySelect;
