// Libraries
import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import _ from 'lodash';

// Styles
import './_FeatureAutomationRow.css';

class FeatureAutomationRow extends Component {

  constructor(props) {
    super(props);
    this.state = this.updateStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.updateStateFromProps(nextProps));
  }

  updateStateFromProps(props) {
    const {
      owner,
      path,
    } = props;
    return {
      editingOwner: owner,
      editingPath: path
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

  onPathChange(value) {
    this.setState({ editingPath: value});
  }

  onEditAxapis() {
    const { id, axapis } = this.props;
    console.log('axapis');
    console.log(axapis);
    this.props.onEditAxapis(id, axapis);
  }

  onPathSave() {
    const { id } = this.props;
    const { editingPath } = this.state;
    this.props.onPathSave(id, editingPath);
  }

  renderAxapis() {
    const { axapis } = this.props;
    const result = _.chain(axapis)
      .map(axapi => {
        const [ method, url ] = axapi.split(' ');
        return { method, url };
      })
      .groupBy(axapi => axapi.method)
      .map((val, key) => `${key} ${val.map(item=>item.url).toString(' ')}`)
      .value()
      .map((item, index) => (<div key={index}>{item}</div>));
    return (
      <div> { result }</div>
    );
  }

  render() {
    const {
      name,
      level,
      collapsed,
      children,
      axapiTestFailCount,
      axapiTestTotalCount,
      unitTestTotalCount,
      unitTestFailCount,
      end2endTestTotalCount,
      end2endTestFailCount
    } = this.props;
    const {
      // editingOwner,
      editingPath
    } = this.state;
    const hasChildren = children && children.length > 0;
    const Indicator = !hasChildren ? <span style={{width: 20, height: 18, display: 'inline-block'}}/> : (
      <span className={`tree-view_arrow${collapsed ? ' tree-view_arrow-collapsed': ''}`} />
    );
    // const users = [
    //   {value: 'zuoping', label: 'zuoping'},
    //   {value: 'roll', label: 'roll'}
    // ];

    const paths = [
      'system',
      'system/board'
    ].map(item => Object.assign({value: item, label: item}));

    return (
      <div className="category-row table-row">
        <span onClick={::this.toggleChildren} style={this.getPaddingLeft(level)}>
          {Indicator} {name}
        </span>
        {/*
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
        */}
        <span>
          <Select
            value={editingPath}
            options={paths}
            onChange={::this.onPathChange}
          />
          <span onClick={::this.onPathSave}>Save</span>
        </span>
        <span onClick={::this.onEditAxapis}>
          { this.renderAxapis() }
          <span onClick={::this.onEditAxapis}>Edit</span>
        </span>
        <span>
          Fail:{unitTestFailCount} Total:{unitTestTotalCount}
        </span>
        <span>
          Fail:{end2endTestFailCount} Total:{end2endTestTotalCount}
        </span>
        <span>
          Fail:{axapiTestFailCount} Total:{axapiTestTotalCount}
        </span>

      </div>
    );
  }
}

FeatureAutomationRow.propTypes = {
  id                    : PropTypes.string,
  parentId              : PropTypes.string,
  name                  : PropTypes.string,
  level                 : PropTypes.number,
  collapsed             : PropTypes.bool,
  children              : PropTypes.array,
  toggleChildren        : PropTypes.func,
  onEditAxapis          : PropTypes.func,
  onPathSave            : PropTypes.func,
  articlesCount         : PropTypes.number,
  path                  : PropTypes.string,
  axapis                : PropTypes.array,
  axapiTestTotalCount   : PropTypes.number,
  axapiTestFailCount    : PropTypes.number,
  unitTestTotalCount    : PropTypes.number,
  unitTestFailCount     : PropTypes.number,
  end2endTestTotalCount : PropTypes.number,
  end2endTestFailCount  : PropTypes.number
};

FeatureAutomationRow.defaultProps = {
  level                 : 0,
  collapsed             : false,
  axapis                : [],
  owner                 : '',
  path                  : '',
  axapiTestTotalCount   : 0,
  axapiTestFailCount    : 0,
  unitTestTotalCount    : 0,
  unitTestFailCount     : 0,
  end2endTestTotalCount : 0,
  end2endTestFailCount  : 0
};

export default FeatureAutomationRow;
