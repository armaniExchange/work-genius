// Libraries
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import TextField from 'material-ui/lib/text-field';
import Select from 'react-select';
import FeatureAutomationCount from '../FeatureAutomationCount/FeatureAutomationCount';
import FeatureAutomationRowInlineToolbar from '../FeatureAutomationRowInlineToolbar/FeatureAutomationRowInlineToolbar';
import { FEATURE_ANALYSIS_DIFFICULTIES } from '../../constants/featureAnalysis';
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

  shouldComponentUpdate(nextProps, /*nextState*/) {
    return !nextProps.isLoading;
  }

  updateStateFromProps(props) {
    const {
      owners,
      path,
      difficulty
    } = props;
    return {
      editingOwners: (owners || []).toString(),
      editingPath: path,
      editingDifficulty: difficulty
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

  onPathChange(event) {
    this.setState({ editingPath: event.target.value});
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

  onPathSave() {
    const { id } = this.props;
    const { editingPath } = this.state;
    this.props.onPathSave(id, editingPath);
  }

  onPathCancel() {
    this.setState({ editingPath: this.props.path });
  }

  onEditAxapis(event) {
    event.preventDefault();
    const { id, axapis } = this.props;
    this.props.onEditAxapis(id, axapis);
  }

  renderAxapis() {
    const { axapis } = this.props;
    const wrapperStyle = {overflow: 'hidden', textOverflow: 'ellipsis'};
    const result = _.chain(['POST', 'GET', 'PUT', 'DELETE'])
      .union(axapis)
      .map(axapi => {
        const [ method, url ] = axapi.split(' ');
        return { method, url };
      })
      .groupBy(axapi => axapi.method)
      .map((val, key) => {
        const hasNoAnyAxapis = val.length === 1 && val[0].url == null;
        return (
          <div key={key} style={wrapperStyle}>
            <span>{key}</span>
            {
               hasNoAnyAxapis ? ( <span className="feature-automation-tag alert">None</span> ) : (
                val.filter(item=> !!item.url)
                .map((item, index) => <span className="feature-automation-tag" key={index}>{item.url}</span>)
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

  onOwnersChange(value) {
    this.setState({ editingOwners: value });
  }

  onOwnersSave() {
    const {
      id,
      onOwnersSave
    } = this.props;
    const { editingOwners } = this.state;

    onOwnersSave(id, editingOwners === '' ? [] : editingOwners.split(','));
  }

  onOwnerCancel() {
    this.setState({ editingOwners: this.props.owners.toString()});
  }

  renderOwners() {
    const {
      owners,
      allUsers,
      children,
      accumOwners
    } = this.props;
    const { editingOwners } = this.state;
    const hasChildren = children && children.length > 0;
    const ownerNames = (accumOwners || []).map( ownerId => {
      return allUsers.filter(user => user.id === ownerId)[0].name;
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
        <FeatureAutomationRowInlineToolbar
          onSave={::this.onOwnersSave}
          onCancel={::this.onOwnerCancel}
          show={editingOwners !== owners.toString()}
        />
        <Select
          multi={true}
          value={editingOwners}
          onChange={::this.onOwnersChange}
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

  onDifficultySave() {
    const {
      id,
      onDifficultySave
    } = this.props;
    onDifficultySave(id, this.state.editingDifficulty);
  }

  onDifficultyCancel() {
    const { difficulty } = this.props;
    this.setState({ editingDifficulty: difficulty });
  }

  onDifficultyChange(value) {
    this.setState({ editingDifficulty: value });
  }

  renderDiffcultyOrDiffculties() {
    const {
      children,
      difficulty,
      difficulties,
    } = this.props;
    const { editingDifficulty } = this.state;
    const hasChildren = children && children.length > 0;

    const DIFFICULTY_COLORS = {
      'Nothing': '#777',
      'Easy': '#5cb85c',
      'Medium': '#f0ad4e',
      'Hard': '#d9534f',
      'Very Hard': 'purple',
      'total': '#5bc0de'
    };

    const difficultyStyle = (difficultyName) => ({
      backgroundColor: DIFFICULTY_COLORS[difficultyName],
      color: 'white',
      padding: '0 4px',
      borderRadius: 5,
      margin: 1,
      cursor: 'help'
    });

    return !hasChildren ? (
      <div>
        <FeatureAutomationRowInlineToolbar
          onSave={::this.onDifficultySave}
          onCancel={::this.onDifficultyCancel}
          show={editingDifficulty !== difficulty}
        />
        <Select
          value={editingDifficulty}
          onChange={::this.onDifficultyChange}
          options={FEATURE_ANALYSIS_DIFFICULTIES.map((difficultyName, index) => {
            return { label: difficultyName, value: index };
          })}
        />
      </div>
    ) : (
      difficulties
      .map((difficultyCount, index) => {
        return {
          difficultyName: FEATURE_ANALYSIS_DIFFICULTIES[index],
          difficultyCount
        };
      })
      .reverse()
      .map((eachDiffculty, index) => {
        const {
          difficultyName,
          difficultyCount
        } = eachDiffculty;
        return (
          <span
            key={index}
            style={difficultyStyle(difficultyName)}
            title ={difficultyName}>
            {difficultyCount}
          </span>
        );
      })
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
      editingPath
    } = this.state;
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
        <span className="difficulty">
          { this.renderDiffcultyOrDiffculties() }
        </span>
        <span className="path">
          {
            !hasChildren ? (
              <div>
                <FeatureAutomationRowInlineToolbar
                  onSave={::this.onPathSave}
                  onCancel={::this.onPathCancel}
                  show={editingPath !== path}
                />
                <TextField
                  value={editingPath}
                  onChange={::this.onPathChange}
                  onKeyDown={::this.onPathKeyDown}
                  style={{width: '95%'}}
                />
              </div>
            ) : null
          }
        </span>
        <span className="axapis">
          {
            !hasChildren ? (
              <a href="#" onClick={!hasChildren ? ::this.onEditAxapis : (e)=> e.preventDefault()}>
                <i className="fa fa-pencil" />&nbsp;Edit
              </a>
            ): null
          }
          {!hasChildren ? this.renderAxapis() : null}
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
          totalCount={unitTestTotalCount}
          failCount={unitTestFailCount}
          testReport={unitTest}
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
  id                    : PropTypes.string,
  parentId              : PropTypes.string,
  name                  : PropTypes.string,
  level                 : PropTypes.number,
  collapsed             : PropTypes.bool,
  children              : PropTypes.array,
  toggleChildren        : PropTypes.func,
  onEditAxapis          : PropTypes.func,
  onPathSave            : PropTypes.func,
  onOwnersSave          : PropTypes.func,
  onDifficultySave      : PropTypes.func,
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
  end2endTestFailCount  : PropTypes.number,
  owners                : PropTypes.array,
  accumOwners           : PropTypes.array,
  difficulties          : PropTypes.array,
  difficulty            : PropTypes.number,
  allUsers              : PropTypes.array,
  isLoading             : PropTypes.bool
};

FeatureAutomationRow.defaultProps = {
  level                 : 0,
  collapsed             : false,
  axapis                : [],
  path                  : '',
  axapiTestTotalCount   : 0,
  axapiTestFailCount    : 0,
  unitTestTotalCount    : 0,
  unitTestFailCount     : 0,
  end2endTestTotalCount : 0,
  end2endTestFailCount  : 0,
  articlesCount         : 0,
  allUsers              : [],
  isLoading             : false
};

export default FeatureAutomationRow;
