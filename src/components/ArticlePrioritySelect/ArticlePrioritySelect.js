// Libraries
import React, { Component } from 'react';
import SelectField from 'material-ui/lib/SelectField';
import MenuItem from 'material-ui/lib/menus/menu-item';

import { PRIORITY_OPTIONS } from '../../constants/config';
import capitalizeFirstLetter from '../../libraries/capitalizeFirstLetter';

// Styles
import './_ArticlePrioritySelect.css';

class ArticlePrioritySelect extends Component {

  render() {
    return (
      <SelectField
        {...this.props}
        floatingLabelText="Priority"
        autoWidth={false} >
        <MenuItem value="" primaryText="&nbsp;" />
        {PRIORITY_OPTIONS.map((item, index) => {
          return(
            <MenuItem
             key={index}
             value={item}
             primaryText={capitalizeFirstLetter(item)} />
          );
        })}
      </SelectField>
    );
  }
}

export default ArticlePrioritySelect;
