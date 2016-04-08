import React, { Component } from 'react';

class KnowledgePage extends Component {
    render() {
        return (
            <div className="knowledge-page">
                { this.props.children }
            </div>
        );
    }
}

export default KnowledgePage;
