// Libraries
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
// Actions
import * as PTOActions from '../../actions/pto-page-actions';
import * as appActions from '../../actions/app-actions';
import * as mainActions from '../../actions/main-actions';
// Components
import Breadcrumb from '../../components/A10-UI/Breadcrumb';
import PTOOvertimeTable from '../../components/PTO-Overtime-Table/PTO-Overtime-Table.js';
import Space from '../../components/A10-UI/Space.js';
import RaisedButton from 'material-ui/lib/raised-button';
import OvertimeApplyModal from '../../components/Overtime-Apply-Modal/Overtime-Apply-Modal';
// Constants
import BREADCRUMB from '../../constants/breadcrumb';
import * as PTOConstants from '../../constants/pto-constants';

class PTOOvertime extends Component {
    componentWillMount() {
        const { fetchOvertimeApplications, currentUser, selectedYear } = this.props;
        fetchOvertimeApplications(currentUser.id, selectedYear);
    }
    _onApplyButtonClicked() {
        const { setOvertimeApplyModalState } = this.props;
        setOvertimeApplyModalState(true);
    }
    _closeOvertimeApplyModal() {
        const { setOvertimeApplyModalState } = this.props;
        setOvertimeApplyModalState(false);
    }
    _onOvertimeApplySubmitClicked(data) {
        const { createOvertimeApplication, currentUser } = this.props;
        let finalData = {
            start_date: data.startDate,
            memo: data.memo,
            hours: data.hours,
            apply_date: moment().format('YYYY-MM-DD'),
            applicant: currentUser.name,
            applicant_id: currentUser.id,
            status: PTOConstants.PENDING
        };
        createOvertimeApplication(finalData);
    }
    render() {
        const {
            overtimeApplications,
            overtimeTitleKeyMap,
            sortOvertimeTableBy,
            sortOvertimeTableByCategory,
            showOvertimeApplyModal
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
                <Space h="20" />
                <RaisedButton
                    label="Overtime Application"
                    onClick={::this._onApplyButtonClicked}
                    labelStyle={{'textTransform':'none'}}
                    secondary={true} />
                <OvertimeApplyModal
                    show={showOvertimeApplyModal}
                    onHideHandler={::this._closeOvertimeApplyModal}
                    onSubmitHandler={::this._onOvertimeApplySubmitClicked}
                    onCancelHandler={::this._closeOvertimeApplyModal} />
            </section>
        );
    }
}

PTOOvertime.propTypes = {
    overtimeApplications: PropTypes.array,
    overtimeTitleKeyMap: PropTypes.array,
    sortOvertimeTableBy: PropTypes.object,
    selectedYear            : PropTypes.number,
    currentUser             : PropTypes.object,
    showOvertimeApplyModal: PropTypes.bool,
    sortOvertimeTableByCategory: PropTypes.func,
    fetchOvertimeApplications: PropTypes.func,
    setOvertimeApplyModalState: PropTypes.func,
    createOvertimeApplication: PropTypes.func
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
