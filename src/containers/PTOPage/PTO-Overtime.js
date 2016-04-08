// Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';

class PTOOvertime extends Component {
    render() {
        return (
            <section>
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
