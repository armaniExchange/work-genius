// Libraries
import React, { Component, PropTypes } from 'react';

import CategoryTreeLeaves from './CategoryTreeLeaves';

class CategoryTree extends Component {

  buildCategoryTree(categories, tree) {

    let filterCategories;

    if (! tree) {

      filterCategories = categories.filter(category => {

        if (category['name'] === 'root') {
          category['leaves'] = [];
          tree = category;
          return false;
        }

        return true;
      });

    } else {

      filterCategories = categories;

    }

    let legacyCategories = filterCategories.filter(category => {
      
      if (category['parentId']) {
        let isFound = this.traversalCategoryTree(tree, category);
        return ! isFound;
      }

    });

    if (legacyCategories && legacyCategories.length) {
      this.buildCategoryTree(legacyCategories, tree);
    }

    return tree;

  }

  traversalCategoryTree(node, category) {
    let isFound = false;

    if (node['id'] === category['parentId']) {
      category['leaves'] = [];
      node['leaves'].push(category);
      isFound = true;
    }

    if (! isFound && node['leaves'] && node['leaves'].length) {

      node['leaves'].some(leaf => {
        if (leaf['id'] === category['parentId']) {
          leaf['leaves'] = leaf['leaves'] || [];
          leaf['leaves'].push(category);
          isFound = true;
          return isFound;
        } else if ( Array.isArray(node['leaves']) && node['leaves'].length ) {
          isFound = this.traversalCategoryTree(leaf, category);
          return isFound;
        }
      });

    }

    return isFound;
  }

  render() {

    const { categories } = this.props;
    const tree = this.buildCategoryTree(categories);

    return (
      <CategoryTreeLeaves data={tree} />
    );
  }
}

CategoryTree.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object)
};

CategoryTree.defaultProps = {
  categories: []
};

export default CategoryTree;
