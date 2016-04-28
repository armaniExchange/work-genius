// Libraries
import React, { Component, PropTypes } from 'react';

// Styles
import './_CategoryRow.css';

class CategoryRow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isCreatingSubCategory: false,
      isEditing: false,
      editingName: props.name,
      editingSubcategoryName: ''
    };
  }

  toggleSubCategories(forceEnable) {
    const {
      id,
      toggleSubCategories
    } = this.props;
    toggleSubCategories({id, forceEnable});
  }

  toggleAddSubcategoreis() {
    const { isCreatingSubCategory } = this.state;
    if (!isCreatingSubCategory) {
      this.toggleSubCategories(true);
    }
    this.setState({
      isCreatingSubCategory: !isCreatingSubCategory,
      editingSubcategoryName: ''
    });
  }

  onNameChange(event) {
    this.setState({editingName: event.currentTarget.value});
  }

  onSubcategoryNameChange(event) {
    this.setState({editingSubcategoryName: event.currentTarget.value});
  }

  toggleEdit() {
    const { isEditing } = this.state;
    this.setState({isEditing: !isEditing});
  }

  getNewId() {
    const { lastId } = this.props;
    return (parseInt(lastId) + 1) + ''; //transform to string
  }

  saveSubcategory() {
    const { id, onSave } = this.props;
    const { editingSubcategoryName } = this.state;
    this.setState({isCreatingSubCategory: false});
    console.log(`save SubCategories id:${this.getNewId()} parentId:${id} name:${editingSubcategoryName}`);
    onSave({
      id: this.getNewId(),
      parentId: id,
      name: editingSubcategoryName
    });
  }

  save() {
    const { id, parentId, onSave } = this.props;
    const { editingName } = this.state;
    this.setState({isEditing: false});
    console.log(`save category id:${id} parentId:${parentId} name:${editingName}`);
    onSave({
      id,
      parentId,
      name: editingName
    });
  }

  onDelete() {
    const { id, onDelete } = this.props;
    console.log(`Delete category id:${id}`);
    onDelete(id);
  }
  render() {
    const {
      id,
      parentId,
      name,
      level,
      expand,
      subCategories
    } = this.props;
    const {
      editingName,
      editingSubcategoryName,
      isEditing,
      isCreatingSubCategory
    } = this.state;
    const hasSubCategories = subCategories && subCategories.length > 0;
    const paddingLeftStyle = {paddingLeft: level * 10};
    const Indicator = !hasSubCategories ? <span>&nbsp;</span> : (
      <span onClick={::this.toggleSubCategories}>{expand ? '+' : '-' }</span>
    );

    const EditRow = (
      <div
        key="edit"
        style={paddingLeftStyle}>
        {Indicator}
        <input type="text"
          value={editingName}
          onChange={::this.onNameChange}
        />
        <a href="#" onClick={::this.toggleEdit}>Cacnel</a>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="#" onClick={::this.save}>Save</a>
      </div>
    );
    const ViewRow = (
      <div
        key="view"
        style={paddingLeftStyle}>
        {Indicator}
        {`id:${id}, parentId:${parentId} name: ${name} `}
        <a href="#" onClick={::this.toggleEdit}>Edit</a>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="#" onClick={::this.toggleAddSubcategoreis}>Add SubCategories</a>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        {
          !hasSubCategories ? <a href="#" onClick={::this.onDelete}>Delete</a> : null
        }
      </div>
    );
    const CreatingSubCategory = (
      <div>
        { ViewRow }
        <div
          key="editSubcategory"
          style={paddingLeftStyle}>
          <input
            type="text"
            value={editingSubcategoryName}
            onChange={::this.onSubcategoryNameChange}
          />
          <a href="#" onClick={::this.saveSubcategory}>Save</a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a href="#" onClick={::this.toggleAddSubcategoreis}>Cancel</a>
        </div>
      </div>
    );

    return isCreatingSubCategory ? CreatingSubCategory :
      isEditing ? EditRow : ViewRow;
  }
}

CategoryRow.propTypes = {
  id                  : PropTypes.string,
  parentId            : PropTypes.string,
  lastId              : PropTypes.string,
  name                : PropTypes.string,
  level               : PropTypes.number,
  expand              : PropTypes.bool,
  subCategories       : PropTypes.array,
  toggleSubCategories : PropTypes.func,
  onSave              : PropTypes.func,
  onDelete            : PropTypes.func
};

CategoryRow.defaultProps = {
  level               : 0,
  expand              : false
};

export default CategoryRow;
