// Libraries
import React, { Component, PropTypes } from 'react';
import ReactDOMServer from 'react-dom/server';
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
import RaisedButton from 'material-ui/lib/raised-button';
import OvertimeApplyModal from '../../components/Overtime-Apply-Modal/Overtime-Apply-Modal';
import DropDownList from '../../components/A10-UI/Input/Drop-Down-List';
import PTOYearFilter from '../../components/PTO-Year-Filter/PTO-Year-Filter';
import PTOMailCard from '../../components/PTO-Mail-Card/PTO-Mail-Card';
// Constants
import BREADCRUMB from '../../constants/breadcrumb';
import * as PTOConstants from '../../constants/pto-constants';
import {  OVERTIME_URL } from '../../constants/config.js';

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
        const {
            createOvertimeApplication,
            currentUser,
            sendMail
        } = this.props;

        let finalData = {
                start_time: data.startTimeStamp,
                memo: data.memo,
                hours: data.hours,
                apply_time: moment().format('x'),
                applicant: currentUser.name,
                applicant_id: currentUser.id,
                status: PTOConstants.PENDING
            },
            mailingConfig = {
                subject: `[KB-PTO] ${finalData.applicant} has a New Overtime Application`,
                html: ReactDOMServer.renderToStaticMarkup(
                    <PTOMailCard
                        type={'OVERTIME_' + finalData.status}
                        applicant={finalData.applicant}
                        startDate={finalData.start_time}
                        hours={finalData.hours}
                        link={OVERTIME_URL} />
                ).replace(/"/g, '\\"'),
                includeManagers: true
            };
        let { to, cc, bcc, subject, text, html, includeManagers } = mailingConfig;

        createOvertimeApplication(finalData);
        sendMail(to, cc, bcc, subject, text, html, includeManagers);
    }
    _onGoToPreviousYearClicked() {
        const { goToPreviousYear } = this.props;
        goToPreviousYear(true);
    }
    _onGoToNextYearClicked() {
        const { goToNextYear } = this.props;
        goToNextYear(true);
    }
    _onOvertimeStatusUpdate(updatedOvertime) {
        const {
            setOvertimeApplicationStatus,
            currentUser,
            sendMail
        } = this.props;
        const { id, status, hours, start_time, applicant_email, applicant } = updatedOvertime;
        let mailingConfig = {
            to: [applicant_email],
            subject: '[KB-PTO] Your Overtime Application has been updated',
            html: ReactDOMServer.renderToStaticMarkup(
                <PTOMailCard
                    type={'OVERTIME_' + status}
                    startDate={start_time}
                    manager={currentUser.name}
                    status={status}
                    hours={hours}
                    applicant={applicant}
                    link={OVERTIME_URL} />
            ).replace(/"/g, '\\"'),
            includeManagers: true
        };
        let { to, cc, bcc, subject, text, html, includeManagers } = mailingConfig;

        setOvertimeApplicationStatus(id, status, hours);
        sendMail(to, cc, bcc, subject, text, html, includeManagers);
    }
    _onUserFilterClickedHandler(id) {
        const {
            resetPTOTable,
            fetchOvertimePageData
        } = this.props;
        resetPTOTable();
        fetchOvertimePageData(id);
    }
    _onOvertimeStatusFilterChange(newStatus) {
        this.props.filterOvertimeTable({'status': newStatus});
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
            allUsersWithClosestPTO,
            currentSelectedUserID,
            selectedYear,
            currentUser
        } = this.props;
        let curUser = allUsersWithClosestPTO.find(
            _user => _user.id === currentSelectedUserID
        );

        return (
            <section className="pto-overtime">
                <Breadcrumb data={BREADCRUMB.overtime} />
                <div className="pto-overtime__filter">
                    <PTOYearFilter
                        selectedYear={selectedYear}
                        goToPreviousYear={::this._onGoToPreviousYearClicked}
                        goToNextYear={::this._onGoToNextYearClicked} />
                    <label>Name:&nbsp;</label>
                    <DropDownList
                        isNeedAll={true}
                        onOptionClick={::this._onUserFilterClickedHandler}
                        title={curUser ? curUser.name : 'All'}
                        aryOptionConfig={allUsersWithClosestPTO.map((item) => {
                            return {title: item.name, value: item.id, subtitle: ''};
                        })} />
                    <label>Status:&nbsp;</label>
                    <DropDownList
                        isNeedAll={true}
                        title={overtimeFilterConditions.status ? overtimeFilterConditions.status : 'All'}
                        onOptionClick={::this._onOvertimeStatusFilterChange}
                        aryOptionConfig={overtimeFilterOptions}
                    />
                    <RaisedButton
                        label="Overtime Application"
                        onClick={::this._onApplyButtonClicked}
                        labelStyle={{'textTransform':'none'}}
                        secondary={true} />
                </div>
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
    goToNextYear                : PropTypes.func,
    sendMail                    : PropTypes.func
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
