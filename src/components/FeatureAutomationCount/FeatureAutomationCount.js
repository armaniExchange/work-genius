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

  render() {
    const {
      totalCount,
      failCount
    } = this.props;
    return (
      <span
        {...this.props}
        className="end2end-test">
        {
          failCount === 0 ? <span>&nbsp;0&nbsp;</span> :
          (
            <Tooltip
              placement="bottom"
              trigger={['hover']}
              overlay={this.renderTooltip()}>
              <a href="#" style={{color: 'red'}}>&nbsp;{failCount}&nbsp;</a>
            </Tooltip>
          )
        }
         / {totalCount}
      </span>
    );

  }
}

FeatureAutomationCount.propTypes = {
  totalCount : PropTypes.number,
  failCount  : PropTypes.number,
  testReport : PropTypes.array,
  keyName    : PropTypes.string
};

FeatureAutomationCount.defaultProps = {
  totalCount : 0,
  failCount  : 0,
  testReport : []
};

export default FeatureAutomationCount;
