// Libraries
import React, { Component, PropTypes } from 'react';
import Select from 'react-select';


// Styles
import './_FeatureAutomationRow.css';

class FeatureAutomationRow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editingOwner: '',
      editingUrl: ''
    };
  }

  toggleChildren(forceEnable) {
    const {
      id,
      toggleChildren
    } = this.props;
    toggleChildren({id, forceEnable});
  }

  getPaddingLeft(level) {
    return { paddingLeft: level * 20 + 10 };
  }

  onOwnerChange(value) {
    console.log(value);
    this.setState({ editingOwner: value});
  }

  onUrlChange(value) {
    this.setState({ editingUrl: value});
  }

  onEditAxapis() {
    const {
      postAxapis,
      getAxapis,
      putAxapis,
      deleteAxapis,
    } = this.props;
    this.props.onEditAxapis({
      postAxapis,
      getAxapis,
      putAxapis,
      deleteAxapis,
    });
  }

  render() {
    const {
      name,
      level,
      collapsed,
      children
    } = this.props;
    const {
      editingOwner,
      editingUrl
    } = this.state;
    const hasChildren = children && children.length > 0;
    const Indicator = !hasChildren ? <span style={{width: 20, height: 18, display: 'inline-block'}}/> : (
      <span className={`tree-view_arrow${collapsed ? ' tree-view_arrow-collapsed': ''}`} />
    );
    const users = [
      {value: 'zuoping', label: 'zuoping'},
      {value: 'roll', label: 'roll'}
    ];

    const urls = [
      'system',
      'system/board'
    ].map(item => Object.assign({value: item, label: item}));

    return (
      <div className="category-row table-row">
        <span onClick={::this.toggleChildren} style={this.getPaddingLeft(level)}>
          {Indicator} {name}
        </span>
        <span>
          300
        </span>
        <span>
          <Select
            multi={true}
            value={editingOwner}
            options={users}
            onChange={::this.onOwnerChange}
          />
        </span>
        <span>
          hard 3, easy 1
        </span>
        <span>
          <Select
            value={editingUrl}
            options={urls}
            onChange={::this.onUrlChange}
          />
        </span>
        <span onClick={::this.onEditAxapis}>
          axapi
        </span>
        <span>
          101 Unit test documents
        </span>
        <span>
          12 Failed, Total 300
        </span>
        <span>
          3 Failed, Total 3000
        </span>

      </div>
    );
  }
}

FeatureAutomationRow.propTypes = {
  id             : PropTypes.string,
  parentId       : PropTypes.string,
  name           : PropTypes.string,
  level          : PropTypes.number,
  collapsed      : PropTypes.bool,
  children       : PropTypes.array,
  toggleChildren : PropTypes.func,
  onEditAxapis   : PropTypes.func,
  articlesCount  : PropTypes.number,
  postAxapis     : PropTypes.array,
  getAxapis      : PropTypes.array,
  putAxapis      : PropTypes.array,
  deleteAxapis   : PropTypes.array,
};

FeatureAutomationRow.defaultProps = {
  level          : 0,
  collapsed      : false,
  postAxapis     : [],
  getAxapis      : [],
  putAxapis      : [],
  deleteAxapis   : [],
};

export default FeatureAutomationRow;
