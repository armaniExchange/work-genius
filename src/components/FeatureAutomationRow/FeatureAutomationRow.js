// Libraries
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import TextField from 'material-ui/lib/text-field';

import FeatureAutomationCount from '../FeatureAutomationCount/FeatureAutomationCount';
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

  onPathKeyDown(event) {
    const { keyCode } = event;
    if (keyCode === 13) {
      // enter
      this.onPathSave();
      return;
    }

    if (keyCode === 27) {
      // esc
      this.onPathCancel();
      return;
    }

  }

  onPathSave(event) {
    event && event.preventDefault();
    const { id } = this.props;
    const { editingPath } = this.state;
    this.props.onPathSave(id, editingPath);
  }

  onPathCancel(event) {
    event && event.preventDefault();
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
      articlesCount,
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
          !hasChildren && editingPath !== path ? (
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
        {
          !hasChildren ? (
            <TextField
              value={editingPath}
              onChange={::this.onPathChange}
              onKeyDown={::this.onPathKeyDown}
              style={{width: '95%'}}
            />
          ) : null
        }
        </span>
        <span className="axapis">
          {!hasChildren ? (
            <a style={{float: 'right'}} href="#" onClick={!hasChildren ? ::this.onEditAxapis : (e)=> e.preventDefault()}>
              <i className="fa fa-pencil" />&nbsp;Edit
            </a>
          ): null}
          {!hasChildren ? this.renderAxapis() : null}
        </span>
        <span className="articles-count">
          {articlesCount}
        </span>
        <FeatureAutomationCount
          className="end2end-test"
          totalCount={end2endTestTotalCount}
          failCount={end2endTestFailCount}
          testReport={end2endTest}
          keyName="path"
        />
        <FeatureAutomationCount
          className="unit-test"
          totalCount={unitTestTotalCount}
          failCount={unitTestFailCount}
          testReport={unitTest}
          keyName="path"
        />
        <FeatureAutomationCount
          className="axapi-test"
          totalCount={axapiTestTotalCount}
          failCount={axapiTestFailCount}
          testReport={axapiTest}
          keyName="api"
        />
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
  end2endTestFailCount  : 0,
  articlesCount         : 0
};

export default FeatureAutomationRow;
