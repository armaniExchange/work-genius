// Style
import './_PTOPage.css';
// Libraries
import React, { Component } from 'react';

class PTOPage extends Component {
    render() {
        return (
            <section>
                { this.props.children }
            </section>
        );
    }
}

export default PTOPage;
