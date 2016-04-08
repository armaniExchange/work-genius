// Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Breadcrumb from '../../components/A10-UI/Breadcrumb';
import BREADCRUMB from '../../constants/breadcrumb';

class PTOOvertime extends Component {
    render() {
        return (
            <section>
                <Breadcrumb data={BREADCRUMB.overtime} />
                Overtime
            </section>
        );
    }
}

PTOOvertime.propTypes = {};

function mapStateToProps(state) {
    return Object.assign(
        {},
        state.pto.toJS(),
        state.app.toJS()
    );
}

function mapDispatchToProps() {
    return Object.assign(
        {}
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PTOOvertime);
