// Libraries
import React, { Component } from 'react';
import SelectField from 'material-ui/lib/SelectField';
import MenuItem from 'material-ui/lib/menus/menu-item';

import { DOCUMENT_TYPE_OPTIONS } from '../../constants/config';
import capitalizeFirstLetter from '../../libraries/capitalizeFirstLetter';

// Styles
import './_ArticleDocumentTypeSelect.css';

class ArticleDocumentTypeSelect extends Component {

  render() {

    return (
      <SelectField
        {...this.props}
        floatingLabelText="Document Type"
        autoWidth={false} >
        <MenuItem value="" primaryText="&nbsp;" />
        {DOCUMENT_TYPE_OPTIONS.map((item, index) => {
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

export default ArticleDocumentTypeSelect;
