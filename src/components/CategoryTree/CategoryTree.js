// Libraries
import React, { Component, PropTypes } from 'react';

class CategoryTree extends Component {

  buildCategoryTree(categories, tree) {
    let root = tree || {
      'id': 'root',
      'root': true,
      'leaves': []
    };

    let legacyCategories = categories.filter(category => {

      if (category.hasOwnProperty('parentId') && category['parentId']) {
        let isFound = this.traversalCategoryTree(root, category);
        return ! isFound;
      } else {
        root['leaves'].push(category);
        return false;
      }

    });

    if (legacyCategories && legacyCategories.length) {
      this.buildCategoryTree(legacyCategories, root);
    }

    return root;

  }

  traversalCategoryTree(node, category) {
    let isFound = false;

    if (node && node['leaves']) {

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

  renderTree(node, level) {
    let leaves = node['leaves'] || [];
    level = level || 1;

    return (
      <ul key={node['id']}>
        <li><a href="#">{node['name']}</a></li>
        {
          leaves.map(leaf => {
            return this.renderTree(leaf, (level + 1));
          })
        }
      </ul>
    );
  }

  render() {

    // const { categories } = this.props;
    // const tree = this.buildCategoryTree(categories);

    return (
      <div />
      // <div>{this.renderTree(tree)}</div>
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
