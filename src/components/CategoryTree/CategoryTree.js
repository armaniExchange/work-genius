// Libraries
import React, { Component, PropTypes } from 'react';

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

  renderTree(node={}, level = 0) {

    const styles = {
      countStyle: {
        float: 'right'
      },
      iconStyle: {
        paddingRight: '0.5em'
      },
      nodeStyle: {
        paddingTop: '4px',
        paddingBottom: '4px'
      }
    };

    let leaves = node['leaves'] || [];

    let caretIcon = <i style={styles['iconStyle']}></i>;

    if (leaves && leaves.length) {
      caretIcon = <i style={styles['iconStyle']} className="fa fa-caret-down"></i>;
    }

    if (node['name'] === 'root') {
      return (
        <div>
          {
            leaves.map(leaf => {
              return this.renderTree(leaf, level);
            })
          }
        </div>
      );
    } else {
      return (
        <div style={{ paddingLeft: (level * 0.5) + 'em'}} key={node['id']}>
          <div style={styles['nodeStyle']}>
            {caretIcon}
            <span>{node['name']}</span>
            <span style={styles['countStyle']}>{node['articlesCount']}</span>
          </div>
          {
            leaves.map(leaf => {
              return this.renderTree(leaf, (level + 1));
            })
          }
        </div>
      );
    }
  }

  render() {

    const { categories } = this.props;
    const tree = this.buildCategoryTree(categories);

    return (
      <div>{this.renderTree(tree)}</div>
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
