// Libraries
import React, { Component, PropTypes } from 'react';
import Tooltip from 'rc-tooltip';
// Styles
import './_FeatureAutomationCount.css';

class FeatureAutomationCount extends Component {

  renderTooltip() {
    const {
      keyName,
      testReport
    } = this.props;
    return (
      testReport.filter(item => !item.isSuccess)
        .map((item, index) => (
          <div key={index} style={{marginBottom: 5}}>
            <span className="feature-automation-tag">{item[keyName]}</span>
            <span>&nbsp;&nbsp;{item.errorMessage}</span>
          </div>
        ))
    );
  }

  renderTotalCount() {
    const {
      keyName,
      testReport,
      totalCount,
      hasChildren
    } = this.props;

    if (!hasChildren && keyName === 'path' && testReport && testReport.length > 0 && testReport[0].path) {
      const link = `/tests/a10_coverage/unit-test/${testReport[0].path}/index.html`;
      return (
        <a href={link}> { totalCount } </a>
      );
    } else {
      return <span>{ totalCount }</span>;
    }
  }

  render() {
    const {
      totalCount,
      failCount,
    } = this.props;
    if ( totalCount === 0 ) {
      return <span {...this.props}>N/A</span>;
    }
    return (
      <span
        {...this.props}>
        {
          failCount === 0 ? <span style={{color: 'green'}}>Pass</span> :
          (
            <Tooltip
              placement="bottom"
              trigger={['hover']}
              overlay={this.renderTooltip()}>
              <a href="#" style={{color: 'red'}}>&nbsp;{failCount}&nbsp;</a>
            </Tooltip>
          )
        }
        &nbsp;/&nbsp;
        { this.renderTotalCount() }
      </span>
    );

  }
}

FeatureAutomationCount.propTypes = {
  totalCount : PropTypes.number,
  failCount  : PropTypes.number,
  testReport : PropTypes.array,
  keyName    : PropTypes.string,
  hasChildren: PropTypes.bool
};

FeatureAutomationCount.defaultProps = {
  totalCount : 0,
  failCount  : 0,
  testReport : [],
  hasChildren: false
};

export default FeatureAutomationCount;
