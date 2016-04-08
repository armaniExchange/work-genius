import React, { Component } from 'react';

class FeatureAnalysisPage extends Component {
    render() {
        return (
            <div className="feature-analysis-page">
                { this.props.children }
            </div>
        );
    }
}

export default FeatureAnalysisPage;
