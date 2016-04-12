import React, { Component } from 'react';

class BugAnalysisPage extends Component {
    render() {
        return (
            <div className="bug-analysis-page">
                { this.props.children }
            </div>
        );
    }
}

export default BugAnalysisPage;
