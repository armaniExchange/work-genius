 // Style
import './_FeatureAutomationPage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as DocumentActions from '../../actions/document-page-actions';


class FeatureAutomationPage extends Component {

  render() {
    return (
      <div>
        <h3>Feature Automation Page</h3>
      </div>
    );
  }
}

FeatureAutomationPage.propTypes = {
  documentCategories       : PropTypes.object,
  documentActions          : PropTypes.object.isRequired
};

FeatureAutomationPage.defaultProps = {
};

function mapStateToProps(state) {
  const {
    documentCategories
  } = state.documentation.toJS();

  return { documentCategories };
}

function mapDispatchToProps(dispatch) {
  return {
    documentActions: bindActionCreators(DocumentActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeatureAutomationPage);
