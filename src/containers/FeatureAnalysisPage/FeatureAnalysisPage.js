import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Components

// Actions
import * as FeatureAnalysisActions from '../../actions/feature-analysis-actions';

class FeatureAnalysisPage extends Component {
    componentWillMount() {
        const { fetchAssignmentCategories } = this.props;
        fetchAssignmentCategories();
    }
    render() {
        return (
            <div>
                Hi
            </div>
        );
    }
}

FeatureAnalysisPage.propTypes = {
    treeDataSource: PropTypes.array.isRequired,
    fetchAssignmentCategories: PropTypes.func.isRequired,
};
FeatureAnalysisPage.defaultProps = {};

function mapStateToProps(state) {
    return Object.assign(
        {},
        state.featureAnalysis.toJS()
    );
}

function mapDispatchToProps(dispatch) {
    return Object.assign(
        {},
        bindActionCreators(FeatureAnalysisActions, dispatch)
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FeatureAnalysisPage);
