import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Components
import AssignmentReportTable from '../../components/AssignmentReportTable/AssignmentReportTable';
// Actions
import * as FeatureAnalysisActions from '../../actions/feature-analysis-actions';

import Breadcrumb from '../../components/A10-UI/Breadcrumb';
import BREADCRUMB from '../../constants/breadcrumb';

class FeatureAnalysisPage extends Component {
    constructor(props){
      super(props);
    }
    componentWillMount() {
        const { fetchAnalysisPageData } = this.props;
        fetchAnalysisPageData();
    }
    render() {
        const {
            aryOwners,
            dataSource
        } = this.props;

        return (
            <div className="row">
                <Breadcrumb data={BREADCRUMB.tablepageassignment} />
                <AssignmentReportTable data={dataSource} userData={aryOwners} />
            </div>
        );
    }
}

FeatureAnalysisPage.propTypes = {
    dataSource: PropTypes.array.isRequired,
    aryOwners: PropTypes.array.isRequired,
    fetchAnalysisPageData: PropTypes.func.isRequired
};
FeatureAnalysisPage.defaultProps = {};

function mapStateToProps(state) {
    return Object.assign(
        {},
        state.featureAnalysis.toJS(),
        state.app.toJS()
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
