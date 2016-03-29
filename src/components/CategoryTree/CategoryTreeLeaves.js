// Libraries
import React, { Component, PropTypes } from 'react';

class CategoryTreeLeaves extends Component {

  renderLeaves(node={}, level = 0) {
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
              return this.renderLeaves(leaf, level);
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
              return this.renderLeaves(leaf, (level + 1));
            })
          }
        </div>
      );
    }
  }

  render() {

    const { data } = this.props;

    return (
      <div>{this.renderLeaves(data)}</div>
    );
  }
}

CategoryTreeLeaves.propTypes = {
  data: PropTypes.object
};

CategoryTreeLeaves.defaultProps = {
  data: {}
};

export default CategoryTreeLeaves;
