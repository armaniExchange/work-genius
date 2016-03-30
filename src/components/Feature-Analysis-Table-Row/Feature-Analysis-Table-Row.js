import React, { Component, PropTypes } from 'react';
import FeatureSelector from '../Feature-Selector/Feature-Selector.js';

class FeatureAnalysisTableRow extends Component {
    _onFeatureChangeHandler(newFeature) {
        const { id } = this.props.data;
        const { onChangeHandler } = this.props;
        onChangeHandler(id, newFeature);
    }
    render() {
        const { id } = this.props.data;
        const { featureOptions } = this.props;
        return (
            <tr>
                <td>
                    {id}
                </td>
                <td>
                    <FeatureSelector
                        options={featureOptions}
                        selected=""
                        onChangeHandler={::this._onFeatureChangeHandler} />
                </td>
            </tr>
        );
    }
}

FeatureAnalysisTableRow.propTypes = {
    data: PropTypes.object.isRequired,
    featureOptions: PropTypes.array,
    onChangeHandler: PropTypes.func
};
FeatureAnalysisTableRow.defaultProps = {
    onChangeHandler: () => {}
};

export default FeatureAnalysisTableRow;
