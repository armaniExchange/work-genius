// Libraries
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Components
import PTOSummaryTable from '../../components/PTO-Summary-Table/PTO-Summary-Table';
import Breadcrumb from '../../components/A10-UI/Breadcrumb';
// Constants
import BREADCRUMB from '../../constants/breadcrumb';
// Actions
import * as PTOActions from '../../actions/pto-page-actions';

class PTOSummary extends Component {
    componentWillMount() {
        const { fetchUsersWithOvertime } = this.props;
        fetchUsersWithOvertime();
    }
    render() {
        const {
            allUsersWithOvertime,
            summaryTitleKeyMap,
            currentUser
        } = this.props;
        return (
            <section>
                <Breadcrumb data={BREADCRUMB.ptoSummary} />
                <PTOSummaryTable
                    data={allUsersWithOvertime}
                    titleKeyMap={summaryTitleKeyMap}
                    highlightName={currentUser.name} />
            </section>
        );
    }
}

PTOSummary.propTypes = {
    allUsersWithOvertime  : PropTypes.array,
    summaryTitleKeyMap    : PropTypes.array,
    currentUser           : PropTypes.object,
    fetchUsersWithOvertime: PropTypes.func
};

function mapStateToProps(state) {
    return Object.assign(
        {},
        state.pto.toJS(),
        state.app.toJS()
    );
}

function mapDispatchToProps(dispatch) {
    return Object.assign(
        {},
        bindActionCreators(PTOActions, dispatch)
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PTOSummary);
