// Libraries
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Actions
import * as PTOActions from '../../actions/pto-page-actions';
import * as appActions from '../../actions/app-actions';
import * as mainActions from '../../actions/main-actions';
// Components
import Breadcrumb from '../../components/A10-UI/Breadcrumb';
import PTOOvertimeTable from '../../components/PTO-Overtime-Table/PTO-Overtime-Table.js';
// Constants
import BREADCRUMB from '../../constants/breadcrumb';



class PTOOvertime extends Component {
    render() {
        const {
            overtimeApplications,
            overtimeTitleKeyMap,
            sortOvertimeTableBy,
            sortOvertimeTableByCategory
        } = this.props;
        return (
            <section>
                <Breadcrumb data={BREADCRUMB.overtime} />
                <PTOOvertimeTable
                    data={overtimeApplications}
                    titleKeyMap={overtimeTitleKeyMap}
                    enableSort={true}
                    sortBy={sortOvertimeTableBy}
                    onSortHandler={sortOvertimeTableByCategory}
                    onStatusUpdateHandler={this._onOvertimeStatusUpdate} />
            </section>
        );
    }
}

PTOOvertime.propTypes = {
    overtimeApplications: PropTypes.array,
    overtimeTitleKeyMap: PropTypes.array,
    sortOvertimeTableBy: PropTypes.object,
    sortOvertimeTableByCategory: PropTypes.func
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
        bindActionCreators(PTOActions, dispatch),
        bindActionCreators(mainActions, dispatch),
        bindActionCreators(appActions, dispatch)
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PTOOvertime);
