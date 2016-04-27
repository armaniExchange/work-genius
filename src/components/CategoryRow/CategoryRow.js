// Libraries
import React, { Component, PropTypes } from 'react';
// import TableRow from 'material-ui/lib/table/table-row';

// Styles
import './_CategoryRow.css';

class CategoryRow extends Component {

  toggleChildren() {
    const {
      id,
      children,
      level,
      isDisplayChildren,
      toggleChildren,
    } = this.props;
    const hasChildren = children && children.length > 0;
    if (!hasChildren) {
      return;
    }
    toggleChildren({
      id,
      children,
      level,
      isDisplayChildren: !isDisplayChildren
    });
  }

  render() {
    const {
      id,
      name,
      children,
      isDisplayChildren
    } = this.props;
    const hasChildren = children && children.length > 0;
    return (
      <div onClick={::this.toggleChildren}>

        {`isDisplayChildren: ${JSON.stringify(isDisplayChildren)}, id:${id}, name: ${name}, hasChildren:${JSON.stringify(hasChildren)}`}
      </div>
    );
  }
}

CategoryRow.propTypes = {
  id: PropTypes.string,
  parentId: PropTypes.string,
  name: PropTypes.string,
  children: PropTypes.array,
  isDisplayChildren: PropTypes.bool,
  level: PropTypes.number,
  toggleChildren: PropTypes.func
  // user              : PropTypes.object.isRequired
};

CategoryRow.defaultProps = {
  // id                : '',
  isDisplayChildren: false,
  children: [],
  level: 0
};

export default CategoryRow;
