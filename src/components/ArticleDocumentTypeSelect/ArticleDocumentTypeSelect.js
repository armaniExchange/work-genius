// Libraries
import React, { Component } from 'react';
import SelectField from 'material-ui/lib/SelectField';
import MenuItem from 'material-ui/lib/menus/menu-item';
// Styles
import './_ArticleDocumentTypeSelect.css';

class ArticleDocumentTypeSelect extends Component {

  render() {
    const documentTypeOptions = [
      'Knowledges',
      'Bugs',
      'Task',
      'Requirement',
      'Enhancement'
    ];

    return (
      <SelectField
        {...this.props}
        floatingLabelText="Document Type"
        autoWidth={false} >
        <MenuItem value="" primaryText="&nbsp;" />
        {documentTypeOptions.map((item, index) => {
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

export default ArticleDocumentTypeSelect;
