// Style
import './_PTOPage';
// React & Redux
import React, { Component } from 'react';

// Components
import PTOForm from '../../components/PTO-Form/PTO-Form';

class PTOPage extends Component {
    render() {
        return (
            <div>
                <section>PTO Page</section>
                <PTOForm />
            </div>
        );
    }
}

export default PTOPage;
