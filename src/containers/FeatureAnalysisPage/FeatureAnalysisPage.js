import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Components
import FeatureAnalysisTableRow from '../../components/Feature-Analysis-Table-Row/Feature-Analysis-Table-Row.js';
// Actions
import * as FeatureAnalysisActions from '../../actions/feature-analysis-actions';

class FeatureAnalysisPage extends Component {
    _onFeatureChangeHandler(id, newFeature) {
        console.log(id, newFeature);
    }
    render() {
        const { data, featureOptions } = this.props;
        let tableRowHTML = data.map((d, i) => {
            return (
                <FeatureAnalysisTableRow
                    key={i}
                    data={d}
                    featureOptions={featureOptions}
                    onChangeHandler={::this._onFeatureChangeHandler}/>
            );
        });
        return (
            <div>
                <table>
                    <tbody>
                        {tableRowHTML}
                    </tbody>
                </table>
            </div>
        );
    }
}

FeatureAnalysisPage.propTypes = {
    featureOptions: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired
};
FeatureAnalysisPage.defaultProps = {};

function mapStateToProps(state) {
    return Object.assign(
        {},
        state.featureAnalysis.toJS()
    );
}

function mapDispatchToProps(dispatch) {
    return {
        featureAnalysisActions: bindActionCreators(FeatureAnalysisActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FeatureAnalysisPage);
