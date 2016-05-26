// Libraries
import React, { Component, PropTypes } from 'react';

// Styles
import './_CategoryRow.css';

class CategoryRow extends Component {

  constructor(props) {
    super(props);
    const {
      name,
      isFeature
    } = props;
    this.state = {
      isCreatingChild: false,
      isEditing: false,
      editingName: name,
      editingChildName: '',
      isEditingFeature: isFeature
    };
  }

  shouldComponentUpdate(nextProps, /*nextState*/) {
    return !nextProps.isLoading;
  }

  toggleChildren(forceEnable) {
    const {
      id,
      toggleChildren
    } = this.props;
    toggleChildren({id, forceEnable});
  }

  toggleAddSubcategoreis(event) {
    const { isCreatingChild } = this.state;
    event.preventDefault();
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

  toggleEdit(event) {
    if (event) {
      event.preventDefault();
    }
    const { isEditing } = this.state;
    this.setState({isEditing: !isEditing});
  }

  saveSubcategory(event) {
    const { id, onSave } = this.props;
    const { editingChildName, isEditingChildFeature } = this.state;
    event.preventDefault();
    this.setState({isCreatingChild: false});
    onSave({
      parentId: id,
      name: editingChildName,
      isFeature: isEditingChildFeature
    });
  }

  save(event) {
    const { id, parentId, onSave } = this.props;
    const { editingName, isEditingFeature } = this.state;
    event.preventDefault();
    this.setState({isEditing: false});
    onSave({
      id,
      parentId,
      name: editingName,
      isFeature: isEditingFeature
    });
  }

  onRemove(event) {
    const { id, onRemove } = this.props;
    event.preventDefault();
    onRemove(id);
  }

  onIsEditingFeatureClick(event) {
    this.setState({ isEditingFeature: event.target.checked });
  }

  onIsEditingChildFeatureClick(event) {
    this.setState({ isEditingChildFeature: event.target.checked });
  }

  getPaddingLeft(level) {
    return { paddingLeft: level * 20 + 10 };
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
      isEditingFeature,
      isEditingChildFeature,
      isEditing,
      isCreatingChild
    } = this.state;
    const hasChildren = children && children.length > 0;
    const isRoot = name === 'root';
    const Indicator = !hasChildren ? <span style={{width: 20, height: 18, display: 'inline-block'}}/> : (
      <span className={`tree-view_arrow${collapsed ? ' tree-view_arrow-collapsed': ''}`} />
    );
    const EditRow = (
      <div className="category-row">
        <span className="category-name" style={this.getPaddingLeft(level)}>
          {Indicator}
          <input type="text"
            value={editingName}
            onChange={::this.onNameChange}
            autoFocus={true}
          />
        </span>
        <span className="is-feature">
          <input type="checkbox"
            checked={isEditingFeature}
            onClick={::this.onIsEditingFeatureClick}
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
      <div className="category-row">
        <span className="category-name" onClick={::this.toggleChildren} style={this.getPaddingLeft(level)}>
          {Indicator} {name}
        </span>
        <span className="is-feature">
          <input type="checkbox"
            disabled={true}
            checked={isEditingFeature}
          />
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
        <div className="category-row">
          <span style={this.getPaddingLeft(level + 2)} className="category-name">
            <input
              type="text"
              value={editingChildName}
              onChange={::this.onChildNameChange}
              autoFocus={true}
            />
          </span>
          <span className="is-feature">
            <input type="checkbox"
              checked={isEditingChildFeature}
              onClick={::this.onIsEditingChildFeatureClick}
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
  id             : PropTypes.string,
  parentId       : PropTypes.string,
  name           : PropTypes.string,
  isFeature      : PropTypes.bool,
  level          : PropTypes.number,
  collapsed      : PropTypes.bool,
  children       : PropTypes.array,
  toggleChildren : PropTypes.func,
  onSave         : PropTypes.func,
  onRemove       : PropTypes.func,
  articlesCount  : PropTypes.number,
  isLoading      : PropTypes.bool
};

CategoryRow.defaultProps = {
  level          : 0,
  collapsed      : false,
  isFeature      : false
};

export default CategoryRow;
