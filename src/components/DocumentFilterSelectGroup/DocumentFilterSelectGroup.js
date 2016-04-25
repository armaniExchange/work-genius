import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/lib/flat-button';

import { DOCUMENT_TYPE_OPTIONS, PRIORITY_OPTIONS } from '../../constants/config';
import capitalizeFirstLetter from '../../libraries/capitalizeFirstLetter';
import DropDownList from '../../components/A10-UI/Input/Drop-Down-List.js';

// Styles
import './_DocumentFilterSelectGroup.css';

class DocumentFilterSelectGroup extends Component {

  onDocumentTypeChange(value) {
    this.props.onChange({documentType: value});
  }

  onPriorityChange(value) {
    this.props.onChange({priority: value});
  }

  onMilestoneChange(value) {
    this.props.onChange({milestone: value});
  }

  onOwnerChange(value) {
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
        <label>Document Type:&nbsp;</label>
        <DropDownList
          isNeedAll={true}
          title={documentType ? capitalizeFirstLetter(documentType) : 'All'}
          onOptionClick={::this.onDocumentTypeChange}
          aryOptionConfig={DOCUMENT_TYPE_OPTIONS.map(item => {
            return { title: capitalizeFirstLetter(item), value: item};
          })}
        />
        <label>Priority:&nbsp;</label>
        <DropDownList
          isNeedAll={true}
          title={priority ? capitalizeFirstLetter(priority) : 'All'}
          onOptionClick={::this.onPriorityChange}
          aryOptionConfig={PRIORITY_OPTIONS.map(item => {
            return { title: capitalizeFirstLetter(item), value: item};
          })}
        />
        <label>Milestone:&nbsp;</label>
        <DropDownList
          isNeedAll={true}
          title={milestone ? milestone : 'All'}
          onOptionClick={::this.onMilestoneChange}
          aryOptionConfig={allMilestones.map(item => {
            return { title: item, value: item};
          })}
        />
        <label>Owner:&nbsp;</label>
        <DropDownList
          isNeedAll={true}
          title={owner ? allUsers.filter(user=> user.id === owner)[0].name : 'All'}
          onOptionClick={::this.onOwnerChange}
          aryOptionConfig={allUsers.map(item => {
            return { title: item.name, value: item.id};
          })}
        />

        <FlatButton
          style={{float: 'right'}}
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
