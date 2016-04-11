import React, { Component } from 'react';

class ResourcePage extends Component {
    render() {
        return (
            <div className="resource-page">
                { this.props.children }
            </div>
        );
    }
}

export default ResourcePage;
