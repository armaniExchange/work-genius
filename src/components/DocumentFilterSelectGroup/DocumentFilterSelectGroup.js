import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/lib/SelectField';
import RaisedButton from 'material-ui/lib/raised-button';
import MenuItem from 'material-ui/lib/menus/menu-item';

import ArticleDocumentTypeSelect from '../../components/ArticleDocumentTypeSelect/ArticleDocumentTypeSelect';
import ArticlePrioritySelect from '../../components/ArticlePrioritySelect/ArticlePrioritySelect';

// Styles
import './_DocumentFilterSelectGroup.css';

class DocumentFilterSelectGroup extends Component {
  constructor(props) {
    super(props);
    this.state = this._getInitialState();
  }

  _getInitialState() {
    return {
      documentType: '',
      priority: '',
      milestone: '',
      owner: ''
    };
  }

  onDocumentTypeChange(event, index, value) {
    this.setState({documentType: value}, this.triggerChange);
  }

  onPriorityChange(event, index, value) {
    this.setState({priority: value}, this.triggerChange);
  }

  onMilestoneChange(event, index, value) {
    this.setState({milestone: value}, this.triggerChange);
  }

  onOwnerChange(event, index, value) {
    this.setState({owner: value}, this.triggerChange);
  }

  clearFilter() {
    this.setState(this._getInitialState(), this.triggerChange);
  }

  triggerChange() {
    this.props.onChange(this.state);
  }

  render() {
    const {
      allUsers,
      allMilestones
    } = this.props;
    const {
      documentType,
      priority,
      milestone,
      owner
    } = this.state;

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
        <RaisedButton
          style={{marginTop: 28}}
          label="Show All"
          secondary={true}
          onClick={::this.clearFilter}/>
      </div>
    );
  }
}

DocumentFilterSelectGroup.propTypes = {
  onChange      : PropTypes.func.isRequired,
  allUsers      : PropTypes.array,
  allMilestones : PropTypes.array
};

DocumentFilterSelectGroup.defaultProps = {
  allUsers      : [],
  allMilestones : []
};

export default DocumentFilterSelectGroup;
