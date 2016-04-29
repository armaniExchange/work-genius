// Libraries
import React, { Component, PropTypes } from 'react';

// Styles
import './_CategoryRow.css';

class CategoryRow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isCreatingChild: false,
      isEditing: false,
      editingName: props.name,
      editingChildName: ''
    };
  }

  toggleChildren(forceEnable) {
    const {
      id,
      toggleChildren
    } = this.props;
    toggleChildren({id, forceEnable});
  }

  toggleAddSubcategoreis() {
    const { isCreatingChild } = this.state;
    if (!isCreatingChild) {
      this.toggleChildren(true);
    }
    this.setState({
      isCreatingChild: !isCreatingChild,
      editingChildName: ''
    });
  }

  onNameChange(event) {
    this.setState({editingName: event.currentTarget.value});
  }

  onChildNameChange(event) {
    this.setState({editingChildName: event.currentTarget.value});
  }

  toggleEdit() {
    const { isEditing } = this.state;
    this.setState({isEditing: !isEditing});
  }

  saveSubcategory() {
    const { id, onSave } = this.props;
    const { editingChildName } = this.state;
    this.setState({isCreatingChild: false});
    onSave({
      parentId: id,
      name: editingChildName
    });
  }

  save() {
    const { id, parentId, onSave } = this.props;
    const { editingName } = this.state;
    this.setState({isEditing: false});
    onSave({
      id,
      parentId,
      name: editingName
    });
  }

  onRemove() {
    const { id, onRemove } = this.props;
    onRemove(id);
  }

  getPaddingLeft(level) {
    return {paddingLeft: level * 20 + 10};
  }

  render() {
    const {
      name,
      level,
      collapsed,
      articlesCount,
      children
    } = this.props;
    const {
      editingName,
      editingChildName,
      isEditing,
      isCreatingChild
    } = this.state;
    const hasChildren = children && children.length > 0;
    const isRoot = name === 'root';
    const Indicator = !hasChildren ? <span style={{width: 20, height: 18, display: 'inline-block'}}/> : (
      <span className={`tree-view_arrow${collapsed ? ' tree-view_arrow-collapsed': ''}`} />
    );
    const EditRow = (
      <div className="category-tree-edit-table-row">
        <span className="category-name" style={this.getPaddingLeft(level)}>
          {Indicator}
          <input type="text"
            value={editingName}
            onChange={::this.onNameChange}
            autoFocus={true}
          />
        </span>
        <span className="article-number">{articlesCount}</span>
        <span className="action">
          <a href="#" onClick={::this.save}>
            <i className="fa fa-check" ariaHidden="true" />
            &nbsp;Save
          </a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a href="#" onClick={::this.toggleEdit}>
            <i className="fa fa-times" ariaHidden="true" />
            &nbsp;Cancel
          </a>
        </span>
      </div>
    );
    const ViewRow = (
      <div className="category-tree-edit-table-row">
        <span className="category-name" onClick={::this.toggleChildren} style={this.getPaddingLeft(level)}>
          {Indicator} {name}
        </span>
        <span className="article-number">{articlesCount}</span>
        <span className="action">
          <a href="#" onClick={::this.toggleAddSubcategoreis}>
            <i className="fa fa-plus" ariaHidden="true" />
            &nbsp;Add Child
          </a>
          {
            !isRoot ? [
              <span key="edit-speerate">&nbsp;&nbsp;|&nbsp;&nbsp;</span>,,
              <a key="edit" href="#" onClick={::this.toggleEdit}>
                <i className="fa fa-pencil" ariaHidden="true" />
                &nbsp;Edit
              </a>
            ]: null
          }

          {
            !isRoot && !hasChildren ? [
              <span key="remove-seperate"> &nbsp;&nbsp;|&nbsp;&nbsp;</span>,
              <a key="remove" href="#" onClick={::this.onRemove}>
                <i className="fa fa-trash-o" ariaHidden="true" />
                &nbsp;Remove
              </a>
            ] : null
          }
        </span>
      </div>
    );
    const CreatingSubCategory = (
      <div>
        { ViewRow }
        <div className="category-tree-edit-table-row">
          <span style={this.getPaddingLeft(level + 2)} className="category-name">
            <input
              type="text"
              value={editingChildName}
              onChange={::this.onChildNameChange}
              autoFocus={true}
            />
          </span>
          <span className="article-number">{articlesCount}</span>
          <span className="action">
            <a href="#" onClick={::this.saveSubcategory}>
              <i className="fa fa-check" ariaHidden="true" />
              &nbsp;Add
            </a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="#" onClick={::this.toggleAddSubcategoreis}>
              <i className="fa fa-times" ariaHidden="true" />
              &nbsp;Cancel
            </a>
          </span>
        </div>
      </div>
    );

    return isCreatingChild ? CreatingSubCategory :
      isEditing ? EditRow : ViewRow;
  }
}

CategoryRow.propTypes = {
  id                  : PropTypes.string,
  parentId            : PropTypes.string,
  lastId              : PropTypes.string,
  name                : PropTypes.string,
  level               : PropTypes.number,
  collapsed              : PropTypes.bool,
  children            : PropTypes.array,
  toggleChildren      : PropTypes.func,
  onSave              : PropTypes.func,
  onRemove            : PropTypes.func,
  articlesCount        : PropTypes.number
};

CategoryRow.defaultProps = {
  level               : 0,
  collapsed              : false
};

export default CategoryRow;
