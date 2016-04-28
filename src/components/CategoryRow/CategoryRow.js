// Libraries
import React, { Component, PropTypes } from 'react';
// import TableRow from 'material-ui/lib/table/table-row';

// Styles
import './_CategoryRow.css';

class CategoryRow extends Component {

  toggleSubCategories() {
    const {
      id,
      toggleSubCategories
    } = this.props;
    toggleSubCategories({ id });
  }

  render() {
    const {
      id,
      name,
      level,
      expand,
      subCategories
    } = this.props;
    const hasSubCategories = subCategories && subCategories.length > 0;
    const indicator = !hasSubCategories ? ' ' : (
      expand ? '+' : '-'
    );
    return (
      <div onClick={::this.toggleSubCategories} style={{paddingLeft: level * 10}}>
        {`${indicator} id:${id}, name: ${name} `}
      </div>
    );
  }
}

CategoryRow.propTypes = {
  id: PropTypes.string,
  parentId: PropTypes.string,
  name: PropTypes.string,
  level: PropTypes.number,
  expand: PropTypes.bool,
  toggleSubCategories: PropTypes.func,
  subCategories: PropTypes.object
};

CategoryRow.defaultProps = {
  level: 0,
  expand: false,
};

export default CategoryRow;
