// Libraries
import React, { Component, PropTypes } from 'react';

import Select from 'react-select';
import FeatureAutomationCount from '../FeatureAutomationCount/FeatureAutomationCount';
import Tooltip from 'rc-tooltip';

// Styles
import './_FeatureAutomationRow.css';

class FeatureAutomationRow extends Component {

  constructor(props) {
    super(props);
    this.state = this.updateStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoading === false && this.props.isLoading !== nextProps.isLoading){
      this.setState(this.updateStateFromProps(nextProps));
    }
  }

  shouldComponentUpdate(nextProps, /*nextState*/) {
    return !nextProps.isLoading;
  }

  updateStateFromProps(props) {
    const {
      path
    } = props;
    return {
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
    // -1 because remove root
    return { paddingLeft: ( level - 1 )* 20 + 10 };
  }


  onEditAxapis(event) {
    event.preventDefault();
    const { id, axapis, path } = this.props;
    this.props.onEditAxapis(id, (axapis || []).map(item=>item.replace(/_/g, '-')), path);
  }

  onOwnersSave(value) {
    const {
      id,
      onOwnersSave
    } = this.props;

    onOwnersSave(id, value === '' ? [] : value.split(','));
  }

  renderOwners() {
    const {
      owners,
      allUsers,
      children,
      accumOwners,
    } = this.props;

    const hasChildren = children && children.length > 0;
    const ownerNames = (accumOwners || []).map( ownerId => {
      return allUsers.filter(user => user.id === ownerId || [{name:''}])[0].name;
    });
    const MAX_DISPLAY_OWNERS_NUM = 2;
    const ownerStyle = {
      backgroundColor: '#f2f9fc',
      borderRadius: 2,
      border: '1px solid #c9e6f2',
      color: '#08c',
      display: 'inline-block',
      fontSize: '0.9em',
      marginLeft: 5,
      marginTop: 5,
      verticalAlign: 'top',
      padding: '0 3px'
    };
    // owners.map((owner, index) => <span key={index}>{owner}&nbsp;</span>)
    return !hasChildren ?  (
      <div>
        <Select
          multi={true}
          value={owners}
          onChange={::this.onOwnersSave}
          options={allUsers.map(item => {
            return { label: item.name, value: item.id};
          })}
        />
      </div>

    ) : (
      <Tooltip
        placement="bottom"
        trigger={['hover']}
        overlay={<div>{ownerNames.join(', ')}</div>}>
        <div>
          {

            ownerNames.splice(0, MAX_DISPLAY_OWNERS_NUM)
            .map((ownerName, index) => {
              return (
                <span key={index} style={ownerStyle}>
                  {ownerName}
                </span>
              );
            })
          }

          {ownerNames.length >=  MAX_DISPLAY_OWNERS_NUM ? <span style={ownerStyle}>...</span> : null}
        </div>
      </Tooltip>
    );
  }

  render() {
    const {
      name,
      level,
      collapsed,
      children,
      path,
      axapis,
      articlesCount,
      axapiTest,
      unitTestAngular,
      unitTestDjango,
      end2endTest,
      axapiTestFailCount,
      axapiTestTotalCount,
      unitTestAngularTotalCount,
      unitTestAngularFailCount,
      unitTestDjangoTotalCount,
      unitTestDjangoFailCount,
      end2endTestTotalCount,
      end2endTestFailCount
    } = this.props;

    const hasChildren = children && children.length > 0;
    const Indicator = !hasChildren ? <span style={{width: 20, height: 18, display: 'inline-block'}}/> : (
      <span className={`tree-view_arrow${collapsed ? ' tree-view_arrow-collapsed': ''}`} />
    );

    return (
      <div className="category-row table-row">
        <span
          className="category-name"
          onClick={::this.toggleChildren}
          style={this.getPaddingLeft(level)}>
          {Indicator} {name}
        </span>
        <span className="owners">
          { this.renderOwners() }
        </span>
        <span className="page-settings">
          {
            !hasChildren ? (
              <div>
                <div>
                  <a href="#" onClick={::this.onEditAxapis}>Page URL</a>
                  {
                    path ? (
                      <strong className="float-right text-success">[OK]</strong>
                    ) : (
                      <strong className="float-right text-danger">[N/A]</strong>
                    )
                  }
                </div>
                <div>
                  <a href="#" onClick={::this.onEditAxapis}>AXAPI</a>
                  {
                    axapis && axapis.length ? (
                     <strong className="float-right text-success">[OK]</strong>
                    ) : (
                      <strong className="float-right text-danger">[N/A]</strong>
                    )
                  }
                </div>
              </div>
            ) : null
          }
        </span>
        <span className="articles-count">{articlesCount}</span>
        <FeatureAutomationCount
          className="end2end-test"
          type="end2end-test"
          totalCount={end2endTestTotalCount}
          failCount={end2endTestFailCount}
          testReport={end2endTest}
          hasChildren={hasChildren}
          keyName="path"
        />
        <FeatureAutomationCount
          className="unit-test"
          type="unit-test"
          framework="angular"
          totalCount={unitTestAngularTotalCount}
          failCount={unitTestAngularFailCount}
          testReport={unitTestAngular}
          hasChildren={hasChildren}
          keyName="path"
        />
        <FeatureAutomationCount
          className="unit-test"
          type="unit-test"
          framework="django"
          totalCount={unitTestDjangoTotalCount}
          failCount={unitTestDjangoFailCount}
          testReport={unitTestDjango}
          hasChildren={hasChildren}
          keyName="path"
        />
        <FeatureAutomationCount
          className="axapi-test"
          type="axapi-test"
          totalCount={axapiTestTotalCount}
          failCount={axapiTestFailCount}
          testReport={axapiTest}
          hasChildren={hasChildren}
          keyName="api"
        />
      </div>
    );
  }
}

FeatureAutomationRow.propTypes = {
  id                        : PropTypes.string,
  parentId                  : PropTypes.string,
  name                      : PropTypes.string,
  level                     : PropTypes.number,
  collapsed                 : PropTypes.bool,
  children                  : PropTypes.array,
  toggleChildren            : PropTypes.func,
  onEditAxapis              : PropTypes.func,
  onPathSave                : PropTypes.func,
  onOwnersSave              : PropTypes.func,
  articlesCount             : PropTypes.number,
  path                      : PropTypes.string,
  axapis                    : PropTypes.array,
  axapiTest                 : PropTypes.array,
  axapiTestTotalCount       : PropTypes.number,
  axapiTestFailCount        : PropTypes.number,

  unitTestAngular           : PropTypes.array,
  unitTestAngularTotalCount : PropTypes.number,
  unitTestAngularFailCount  : PropTypes.number,

  unitTestDjango            : PropTypes.array,
  unitTestDjangoTotalCount  : PropTypes.number,
  unitTestDjangoFailCount   : PropTypes.number,

  end2endTest               : PropTypes.array,
  end2endTestTotalCount     : PropTypes.number,
  end2endTestFailCount      : PropTypes.number,
  owners                    : PropTypes.array,
  accumOwners               : PropTypes.array,
  allUsers                  : PropTypes.array,
  isLoading                 : PropTypes.bool
};

FeatureAutomationRow.defaultProps = {
  level                     : 0,
  collapsed                 : false,
  axapis                    : [],
  path                      : '',
  axapiTestTotalCount       : 0,
  axapiTestFailCount        : 0,
  unitTestAngularTotalCount : 0,
  unitTestAngularFailCount  : 0,
  unitTestDjangoTotalCount  : 0,
  unitTestDjangoFailCount   : 0,
  end2endTestTotalCount     : 0,
  end2endTestFailCount      : 0,
  articlesCount             : 0,
  allUsers                  : [],
  isLoading                 : false
};

export default FeatureAutomationRow;
