import React, { Component, PropTypes } from 'react';

class FeatureSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFeature: this.props.selected
        };
    }
    _onChangeHandler(e) {
        this.setState({
            selectedFeature: e.target.value
        }, () => {
            this.props.onChangeHandler(this.state.selectedFeature);
        });
    }
    render() {
        let optionHtml = this.props.options.map((opt, i) => {
            return (
                <option key={i}>{opt.name}</option>
            );
        });
        return (
            <div className="feature-selector">
                <select value={this.state.selectedFeature} onChange={::this._onChangeHandler}>
                    {optionHtml}
                </select>
            </div>
        );
    }
}

FeatureSelector.propTypes = {
    selected: PropTypes.string.isRequired,
    options: PropTypes.array,
    onChangeHandler: PropTypes.func
};
FeatureSelector.defaultProps = {
    options: [],
    onChangeHandler: () => {}
};

export default FeatureSelector;
