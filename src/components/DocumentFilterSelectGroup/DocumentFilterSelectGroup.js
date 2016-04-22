import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/lib/SelectField';
import FlatButton from 'material-ui/lib/flat-button';
import MenuItem from 'material-ui/lib/menus/menu-item';

import ArticleDocumentTypeSelect from '../../components/ArticleDocumentTypeSelect/ArticleDocumentTypeSelect';
import ArticlePrioritySelect from '../../components/ArticlePrioritySelect/ArticlePrioritySelect';

// Styles
import './_DocumentFilterSelectGroup.css';

class DocumentFilterSelectGroup extends Component {

  onDocumentTypeChange(event, index, value) {
    this.props.onChange({documentType: value});
  }

  onPriorityChange(event, index, value) {
    this.props.onChange({priority: value});
  }

  onMilestoneChange(event, index, value) {
    this.props.onChange({milestone: value});
  }

  onOwnerChange(event, index, value) {
    this.props.onChange({owner: value});
  }

  clearFilter() {
    this.props.onChange({
      documentType: '',
      priority: '',
      milestone: '',
      owner: ''
    });
  }

  triggerChange() {
    this.props.onChange(this.state);
  }

  render() {
    const {
      allUsers,
      allMilestones,
      documentType,
      priority,
      milestone,
      owner
    } = this.props;

    return (
      <div className="document-filter-select-group">
        <ArticleDocumentTypeSelect
          value={documentType}
          onChange={::this.onDocumentTypeChange}
        />
        <ArticlePrioritySelect
          value={priority}
          onChange={::this.onPriorityChange}
        />
        <SelectField
          value={milestone}
          onChange={::this.onMilestoneChange}
          floatingLabelText="Milestone"
          autoWidth={false} >
          <MenuItem value="" primaryText="&nbsp;" />
          {allMilestones.map((item, index) => {
            return(
              <MenuItem
               key={index}
               value={item}
               primaryText={item} />
            );
          })}
        </SelectField>
        <SelectField
          floatingLabelText="Owner"
          value={owner}
          onChange={::this.onOwnerChange}
        >
          <MenuItem value="" primaryText="&nbsp;" />
          {allUsers.map((user, index) => {
            return(
              <MenuItem
               key={index}
               value={user.id}
               primaryText={user.name} />
            );
          })}
        </SelectField>
        <div style={{flex: 1}} />
        <FlatButton
          style={{marginTop: 28}}
          label="All Articles"
          secondary={true}
          onClick={::this.clearFilter}/>
      </div>
    );
  }
}

DocumentFilterSelectGroup.propTypes = {
  onChange           : PropTypes.func.isRequired,
  allUsers           : PropTypes.array,
  allMilestones      : PropTypes.array,
  currentPage        : PropTypes.number,
  tag                : PropTypes.string,
  documentType       : PropTypes.string,
  priority           : PropTypes.string,
  milestone          : PropTypes.string,
  owner              : PropTypes.string,
};

DocumentFilterSelectGroup.defaultProps = {
  allUsers           : [],
  allMilestones      : []
};

export default DocumentFilterSelectGroup;
