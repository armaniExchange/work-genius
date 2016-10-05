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
// Constants
import * as PTOConstants from '../../constants/pto-constants';
import BREADCRUMB from '../../constants/breadcrumb';
import {  PTO_URL } from '../../constants/config.js';
// Components
import PTOApplyModal from '../../components/PTO-Apply-Modal/PTO-Apply-Modal';
import PTOTable from '../../components/PTO-Table/PTO-Table';
import PTOYearFilter from '../../components/PTO-Year-Filter/PTO-Year-Filter';
// import NameFilterGroup from '../../components/Name-Filter-Group/Name-Filter-Group.js';
import DropDownList from '../../components/A10-UI/Input/Drop-Down-List.js';
import RaisedButton from 'material-ui/lib/raised-button';
import Breadcrumb from '../../components/A10-UI/Breadcrumb';
import PTOMailCard from '../../components/PTO-Mail-Card/PTO-Mail-Card';

class PTOApplication extends Component {
    componentWillMount() {
        const {
            fetchPTOPageData,
            currentUser,
            selectedYear
        } = this.props;
        fetchPTOPageData(currentUser.id, selectedYear);
    }
    componentWillUnmount() {
        const { resetPTOTable } = this.props;
        resetPTOTable();
    }
    _onApplyButtonClicked() {
        const { setPTOApplyModalState } = this.props;
        setPTOApplyModalState(true);
    }
    _closePTOApplyModal() {
        const { setPTOApplyModalState } = this.props;
        setPTOApplyModalState(false);
    }
    _onPTOApplySubmitClicked(data) {
        const { createPTOApplication, currentUser, sendMail } = this.props;
        let finalData = {
                start_time: data.startTimeStamp,
                end_time: data.endTimeStamp,
                memo: data.memo,
                hours: data.hours,
                apply_time: moment().format('x'),
                applicant_id: currentUser.id,
                applicant: currentUser.name,
                status: PTOConstants.PENDING
            },
            mailingConfig = {
                subject: `[KB-PTO] ${finalData.applicant} has a New PTO Application`,
                html: ReactDOMServer.renderToStaticMarkup(
                    <PTOMailCard
                        type={'PTO_' + finalData.status}
                        applicant={finalData.applicant}
                        startDate={moment(+finalData.start_time).format('YYYY-MM-DD HH:mm')}
                        endDate={moment(+finalData.end_time).format('YYYY-MM-DD HH:mm')}
                        hours={finalData.hours}
                        link={PTO_URL} />
                ).replace(/"/g, '\\"'),
                cc: PTOConstants.HR_MANAGERS_EMAIL.concat(currentUser.email),
                includeManagers: true
            };
        let { to, cc, bcc, subject, text, html, includeManagers } = mailingConfig;

        createPTOApplication(finalData);
        sendMail(to, cc, bcc, subject, text, html, includeManagers);
    }
    _onPTORemoveClicked(id) {
        const { removePTOApplication } = this.props;
        removePTOApplication(id);
    }
    _onGoToPreviousYearClicked() {
        const { goToPreviousYear } = this.props;
        goToPreviousYear(false);
    }
    _onGoToNextYearClicked() {
        const { goToNextYear } = this.props;
        goToNextYear(false);
    }
    _onApplicationStatusUpdate(updatedPtoApplication) {
        const {
            setPTOApplicationStatus,
            currentUser,
            sendMail
        } = this.props;
        const {
            id,
            status,
            hours,
            start_time,
            applicant,
            end_time,
            applicant_email
        } = updatedPtoApplication;

        let mailingConfig = {
            to: [applicant_email],
            subject: status === PTOConstants.CANCEL_REQUEST_PENDING ? `[KB-PTO] ${applicant} has canceld a PTO Application` : '[KB-PTO] Your PTO Application has been updated',
            html: ReactDOMServer.renderToStaticMarkup(
                <PTOMailCard
                    type={'PTO_' + status}
                    applicant={applicant}
                    startDate={moment(+start_time).format('YYYY-MM-DD HH:mm')}
                    endDate={moment(+end_time).format('YYYY-MM-DD HH:mm')}
                    status={status}
                    manager={currentUser.name}
                    hours={hours}
                    link={PTO_URL} />
            ).replace(/"/g, '\\"'),
            cc: PTOConstants.HR_MANAGERS_EMAIL.concat(currentUser.email),
            includeManagers: true
        };
        let { to, cc, bcc, subject, text, html, includeManagers } = mailingConfig;

        setPTOApplicationStatus(id, status, hours);
        sendMail(to, cc, bcc, subject, text, html, includeManagers);
    }
    _onUserFilterClickedHandler(id) {
        const {
            resetPTOTable,
            fetchPTOPageData
        } = this.props;
        resetPTOTable();
        fetchPTOPageData(id);
    }
    _onPTOStatusFilterChange(newStatus) {
        this.props.filterPTOTable({
            status: newStatus
        });
    }
    render() {
        const {
            showPTOApplyModal,
            applications,
            ptoTitleKeyMap,
            ptoFilterConditions,
            allUsersWithClosestPTO,
            ptoFilterOptions,
            currentSelectedUserID,
            currentUser,
            sortPTOTableByCategory,
            sortPTOTableBy,
            selectedYear
        } = this.props;

        let curUser = allUsersWithClosestPTO.find(
            _user => _user.id === currentSelectedUserID
        );

        return (
            <section className="pto-application">
                <Breadcrumb data={BREADCRUMB.ptoapply} />
                <div className="pto-application__filter">
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
                            return {title: item.name, value: item.id, subtitle: item.subtitle};
                        })} />
                    <label>Status:&nbsp;</label>
                    <DropDownList
                        isNeedAll={true}
                        title={ptoFilterConditions.status ? ptoFilterConditions.status : 'All'}
                        onOptionClick={::this._onPTOStatusFilterChange}
                        aryOptionConfig={ptoFilterOptions}
                    />
                    <RaisedButton
                        className="pto-application__filter-button"
                        label="PTO Application"
                        onClick={::this._onApplyButtonClicked}
                        labelStyle={{'textTransform':'none'}}
                        secondary={true} />
                </div>
                <PTOTable
                    data={applications}
                    titleKeyMap={ptoTitleKeyMap}
                    enableSort={true}
                    sortBy={sortPTOTableBy}
                    onSortHandler={sortPTOTableByCategory}
                    onStatusUpdateHandler={::this._onApplicationStatusUpdate}
                    isUserAdmin={currentUser.privilege >= 10}
                    currentUserName={currentUser.name} />
                <PTOApplyModal
                    show={showPTOApplyModal}
                    onHideHandler={::this._closePTOApplyModal}
                    onSubmitHandler={::this._onPTOApplySubmitClicked}
                    onCancelHandler={::this._closePTOApplyModal} />
            </section>
        );
    }
}

PTOApplication.propTypes = {
    applications            : PropTypes.array,
    ptoTitleKeyMap          : PropTypes.array,
    applicationsOriginalData: PropTypes.array,
    allUsersWithClosestPTO  : PropTypes.array,
    ptoFilterOptions        : PropTypes.array,
    showPTOApplyModal       : PropTypes.bool,
    ptoFilterConditions     : PropTypes.object,
    sortPTOTableBy          : PropTypes.object,
    currentUser             : PropTypes.object,
    currentSelectedUserID   : PropTypes.string,
    selectedYear            : PropTypes.number,
    setPTOApplyModalState   : PropTypes.func,
    setLoadingState         : PropTypes.func,
    createPTOApplication    : PropTypes.func,
    filterPTOTable          : PropTypes.func,
    sortPTOTableByCategory  : PropTypes.func,
    setPTOApplicationStatus : PropTypes.func,
    removePTOApplication    : PropTypes.func,
    fetchPTOPageData        : PropTypes.func,
    resetPTOTable           : PropTypes.func,
    goToPreviousYear        : PropTypes.func,
    goToNextYear            : PropTypes.func,
    sendMail                : PropTypes.func
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
)(PTOApplication);
