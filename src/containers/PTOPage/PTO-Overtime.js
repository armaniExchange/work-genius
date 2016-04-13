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
import PTOOvertimeTable from '../../components/PTO-Overtime-Table/PTO-Overtime-Table';
import Space from '../../components/A10-UI/Space';
import RaisedButton from 'material-ui/lib/raised-button';
import OvertimeApplyModal from '../../components/Overtime-Apply-Modal/Overtime-Apply-Modal';
import RadioGroup from '../../components/A10-UI/Input/Radio-Group';
import DropDownList from '../../components/A10-UI/Input/Drop-Down-List';
import PTOYearFilter from '../../components/PTO-Year-Filter/PTO-Year-Filter';
// Constants
import BREADCRUMB from '../../constants/breadcrumb';
import * as PTOConstants from '../../constants/pto-constants';

class PTOOvertime extends Component {
    componentWillMount() {
        const {
            fetchOvertimePageData,
            currentUser,
            selectedYear
        } = this.props;
        fetchOvertimePageData(currentUser.id, selectedYear);
    }
    componentWillUnmount() {
        const { resetPTOTable } = this.props;
        resetPTOTable();
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
    _onOvertimeStatusUpdate(id, newState, hours) {
        const { setOvertimeApplicationStatus } = this.props;
        setOvertimeApplicationStatus(id, newState, hours);
    }
    _onUserFilterClickedHandler(id) {
        const {
            resetPTOTable,
            fetchOvertimePageData
        } = this.props;
        resetPTOTable();
        fetchOvertimePageData(id);
    }
    render() {
        const {
            overtimeApplications,
            overtimeTitleKeyMap,
            sortOvertimeTableBy,
            sortOvertimeTableByCategory,
            showOvertimeApplyModal,
            overtimeFilterOptions,
            overtimeFilterConditions,
            filterOvertimeTable,
            allUsersWithClosestPTO,
            currentSelectedUserID,
            selectedYear,
            currentUser,
            goToPreviousYear,
            goToNextYear
        } = this.props;
        let dropdownTitle = 'All';
        let curUser = allUsersWithClosestPTO.find(_user => {
            if (_user.id===currentSelectedUserID) {
                return _user;
            }
        });
        if (curUser && curUser.name) {
            dropdownTitle = curUser.name;
        }

        return (
            <section>
                <Breadcrumb data={BREADCRUMB.overtime} />
                <PTOYearFilter
                    selectedYear={selectedYear}
                    goToPreviousYear={() => {goToPreviousYear(true);}}
                    goToNextYear={() => {goToNextYear(true);}} />
                <Space h="20" />
                <DropDownList
                    isNeedAll={true}
                    onOptionClick={::this._onUserFilterClickedHandler}
                    title={dropdownTitle}
                    aryOptionConfig={allUsersWithClosestPTO.map((item) => {
                        return {title: item.name, value: item.id, subtitle: ''};
                    })} />
                <Space h="20" />
                <RadioGroup
                    title="Status"
                    isNeedAll={true}
                    aryRadioConfig={overtimeFilterOptions}
                    checkRadio={overtimeFilterConditions.status}
                    onRadioChange={(curVal)=>{
                        filterOvertimeTable({'status': curVal});
                    }} />
                <Space h="20" />
                <RaisedButton
                    label="Overtime Application"
                    onClick={::this._onApplyButtonClicked}
                    labelStyle={{'textTransform':'none'}}
                    secondary={true} />
                <Space h="20" />
                <PTOOvertimeTable
                    data={overtimeApplications}
                    titleKeyMap={overtimeTitleKeyMap}
                    enableSort={true}
                    sortBy={sortOvertimeTableBy}
                    isUserAdmin={currentUser.privilege >= 10}
                    onSortHandler={sortOvertimeTableByCategory}
                    onStatusUpdateHandler={::this._onOvertimeStatusUpdate} />
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
    currentSelectedUserID       : PropTypes.string,
    selectedYear                : PropTypes.number,
    showOvertimeApplyModal      : PropTypes.bool,
    currentUser                 : PropTypes.object,
    overtimeFilterConditions    : PropTypes.object,
    sortOvertimeTableBy         : PropTypes.object,
    overtimeApplications        : PropTypes.array,
    overtimeTitleKeyMap         : PropTypes.array,
    allUsersWithClosestPTO      : PropTypes.array,
    overtimeFilterOptions       : PropTypes.array,
    sortOvertimeTableByCategory : PropTypes.func,
    fetchOvertimePageData       : PropTypes.func,
    setOvertimeApplyModalState  : PropTypes.func,
    createOvertimeApplication   : PropTypes.func,
    setOvertimeApplicationStatus: PropTypes.func,
    filterOvertimeTable         : PropTypes.func,
    resetPTOTable               : PropTypes.func,
    goToPreviousYear            : PropTypes.func,
    goToNextYear                : PropTypes.func
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
