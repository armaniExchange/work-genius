// Libraries
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import TextField from 'material-ui/lib/text-field';
import Tooltip from 'rc-tooltip';
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
    this.setState({ editingOwner: value});
  }

  onPathChange(event) {
    this.setState({ editingPath: event.target.value});
  }

  onEditAxapis(event) {
    event.preventDefault();
    const { id, axapis } = this.props;
    this.props.onEditAxapis(id, axapis);
  }

  onPathSave(event) {
    event.preventDefault();
    const { id } = this.props;
    const { editingPath } = this.state;
    this.props.onPathSave(id, editingPath);
  }

  onPathCancel(event) {
    event.preventDefault();
    this.setState({ editingPath: this.props.path });
  }

  renderAxapis() {
    const { axapis } = this.props;
    const result = _.chain(axapis)
      .union(['POST', 'GET', 'PUT', 'DELETE'])
      .map(axapi => {
        const [ method, url ] = axapi.split(' ');
        return { method, url };
      })
      .groupBy(axapi => axapi.method)
      .map((val, key) => {
        return (
          <div key={key}>
            <span>{key}</span>
            {
              val.length === 1 && val[0].url == null ? (
                  <span className="feature-automation-tag alert">None</span>
                ) : (
                val.map((item, index) => {
                  return ( item.url && <span className="feature-automation-tag" key={index}>{item.url}</span> );
                })
               )
            }
          </div>
        );
      })
      .value();
    return (
      <div>{ result }</div>
    );
  }

  renderTooltip(testReport, key) {
    return (
      testReport.filter(item => !item.isSuccess)
        .map((item, index) => (
          <div key={index}>
            <span className="feature-automation-tag">{item[key]}</span>
            <span>&nbsp;&nbsp;{item.errorMessage}</span>
          </div>
        ))
    );
  }

  render() {
    const {
      name,
      level,
      collapsed,
      children,
      path,
      axapiTest,
      unitTest,
      end2endTest,
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

    return (
      <div className="category-row table-row">
        <span
          className="category-name"
          onClick={::this.toggleChildren}
          style={this.getPaddingLeft(level)}>
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
        <span className="path">
        {
          editingPath !== path ? (
            <div  style={{position: 'absolute', right: 10, top: -10}}>
              <a href="#"
                className="button" onClick={::this.onPathSave}>
                <i className="fa fa-save" />&nbsp;Save
              </a>
              <a href="#"
                className="button" onClick={::this.onPathCancel}>
                <i className="fa fa-times" />&nbsp;Cancel
              </a>
            </div>
          ) : null
        }
          <TextField
            value={editingPath}
            onChange={::this.onPathChange}
            style={{width: '95%'}}
          />
        </span>
        <span className="axapis" onClick={::this.onEditAxapis}>{this.renderAxapis()}</span>
        <span className="end2end-test">
          <Tooltip
            placement="bottom"
            trigger={['hover']}
            overlay={this.renderTooltip(end2endTest, 'path')}>
            <a href="#" style={{color: 'red'}}>{end2endTestFailCount}</a>
          </Tooltip>
          /{end2endTestTotalCount}
        </span>
        <span className="unit-test">
          <Tooltip
            placement="bottom"
            trigger={['hover']}
            overlay={this.renderTooltip(unitTest, 'path')}>
            <a href="#" style={{color: 'red'}}>{unitTestFailCount}</a>
          </Tooltip>
          /{unitTestTotalCount}
        </span>
        <span className="axapi-test">
          <Tooltip
            placement="bottom"
            trigger={['hover']}
            overlay={this.renderTooltip(axapiTest, 'api')}>
            <a href="#" style={{color: 'red'}}>{axapiTestFailCount}</a>
          </Tooltip>
          /{axapiTestTotalCount}
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
  axapiTest             : PropTypes.array,
  axapiTestTotalCount   : PropTypes.number,
  axapiTestFailCount    : PropTypes.number,
  unitTest              : PropTypes.array,
  unitTestTotalCount    : PropTypes.number,
  unitTestFailCount     : PropTypes.number,
  end2endTest           : PropTypes.array,
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
