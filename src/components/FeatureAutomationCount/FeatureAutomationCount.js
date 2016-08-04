// Libraries
import React, { Component, PropTypes } from 'react';
import Tooltip from 'rc-tooltip';
import { UNIT_TEST_REPORT_URL } from '../../constants/config.js';

// Styles
import './_FeatureAutomationCount.css';

const MAX_TOOLTIPS_IN_PARENT_NODE = 10;
class FeatureAutomationCount extends Component {

  renderTooltip() {
    const {
      keyName,
      testReport,
      hasChildren,
    } = this.props;
    const length = testReport.length;
    return (
      testReport.filter(item => item && !item.isSuccess)
        .slice(0, hasChildren ? MAX_TOOLTIPS_IN_PARENT_NODE : length)
        .map((item, index) => (
          <div key={index} style={{marginBottom: 5}}>
            <span className="feature-automation-tag">{item[keyName]}</span>
            <span>&nbsp;&nbsp;{item.errorMessage}</span>
          </div>
        ))
        .concat(hasChildren && length > MAX_TOOLTIPS_IN_PARENT_NODE ? (<div className="text-info text-right">Exapnd children to see more ...</div>) : null)
    );
  }

  renderTotalCount() {
    const {
      type,
      testReport,
      totalCount,
      framework,
      hasChildren,
    } = this.props;

    if (!hasChildren && type === 'unit-test' && framework === 'angular' && testReport && testReport.length > 0 && testReport[0].path) {
      const link = `${UNIT_TEST_REPORT_URL}/${testReport[0].path}/index.html`;
      return (
        <a href={link} target="_blank"> { totalCount } </a>
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
              <a href="#" style={{color: 'red'}} onClick={e=>e.preventDefault()}>&nbsp;{failCount}&nbsp;</a>
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
  hasChildren: PropTypes.bool,
  type       : PropTypes.string,
  framework  : PropTypes.string
};

FeatureAutomationCount.defaultProps = {
  totalCount : 0,
  failCount  : 0,
  testReport : [],
  hasChildren: false
};

export default FeatureAutomationCount;
