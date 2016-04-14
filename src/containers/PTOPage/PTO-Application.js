// Libraries
import React, { Component, PropTypes } from 'react';
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
// Components
import PTOApplyModal from '../../components/PTO-Apply-Modal/PTO-Apply-Modal';
import PTOTable from '../../components/PTO-Table/PTO-Table';
import PTOYearFilter from '../../components/PTO-Year-Filter/PTO-Year-Filter';
// import NameFilterGroup from '../../components/Name-Filter-Group/Name-Filter-Group.js';
import RadioGroup from '../../components/A10-UI/Input/Radio-Group.js';
import DropDownList from '../../components/A10-UI/Input/Drop-Down-List.js';
import Space from '../../components/A10-UI/Space.js';
import RaisedButton from 'material-ui/lib/raised-button';
import Breadcrumb from '../../components/A10-UI/Breadcrumb';

class PTOApplication extends Component {
    constructor(props) {
        super(props);
        this._onApplyButtonClicked = ::this._onApplyButtonClicked;
        this._onPTOApplySubmitClicked = ::this._onPTOApplySubmitClicked;
        this._closePTOApplyModal = ::this._closePTOApplyModal;
        this._onPTORemoveClicked = ::this._onPTORemoveClicked;
        this._onApplicationStatusUpdate = ::this._onApplicationStatusUpdate;
        this._onUserFilterClickedHandler = ::this._onUserFilterClickedHandler;
    }
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
        const { createPTOApplication, currentUser } = this.props;
        let finalData = {
            start_date: data.startDate,
            end_date: data.endDate,
            memo: data.memo,
            hours: data.hours,
            apply_date: moment().format('YYYY-MM-DD'),
            applicant: currentUser.name,
            applicant_id: currentUser.id,
            status: PTOConstants.PENDING
        };
        createPTOApplication(finalData);
    }
    _onPTORemoveClicked(id) {
        const { removePTOApplication } = this.props;
        removePTOApplication(id);
    }
    _onApplicationStatusUpdate(id, newState, hours) {
        const { setPTOApplicationStatus } = this.props;
        setPTOApplicationStatus(id, newState, hours);
    }
    _onUserFilterClickedHandler(id) {
        const {
            resetPTOTable,
            fetchPTOPageData
        } = this.props;
        resetPTOTable();
        fetchPTOPageData(id);
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
            filterPTOTable,
            currentUser,
            sortPTOTableByCategory,
            sortPTOTableBy
        } = this.props;

        const KEY = 'status';

        let curUser = allUsersWithClosestPTO.find(_user => {
            if (_user.id===currentSelectedUserID) {
                return _user;
            }
        });
        let dropdownTitle = 'All';
        if (curUser && curUser.name) {
            dropdownTitle = curUser.name + (curUser.subtitle ? ' - ' + curUser.subtitle : '');
        }
        
        return (
            <section>
                <Breadcrumb data={BREADCRUMB.ptoapply} />
                <PTOYearFilter {...this.props} />
                <Space h="20" />
                <DropDownList
                    isNeedAll={true}
                    onOptionClick={this._onUserFilterClickedHandler}
                    title={dropdownTitle}
                    aryOptionConfig={allUsersWithClosestPTO.map((item) => {
                        return {title: item.name, value: item.id, subtitle: item.subtitle};
                    })} />

                {/*<NameFilterGroup
                    users={allUsersWithClosestPTO}
                    currentSelectedUserID={currentSelectedUserID}
                    onUserClickedHandler={this._onUserFilterClickedHandler} />*/}
                <Space h="20" />
                <RadioGroup
                    title="Status"
                    isNeedAll={true}
                    aryRadioConfig={ptoFilterOptions}
                    checkRadio={ptoFilterConditions.status}
                    onRadioChange={(curVal)=>{
                        filterPTOTable({[KEY]:curVal});
                    }} />
                <Space h="20" />
                <RaisedButton
                    label="PTO Application"
                    onClick={this._onApplyButtonClicked}
                    labelStyle={{'textTransform':'none'}}
                    secondary={true} />
                <Space h="20" />
                <PTOTable
                    data={applications}
                    titleKeyMap={ptoTitleKeyMap}
                    enableSort={true}
                    sortBy={sortPTOTableBy}
                    onSortHandler={sortPTOTableByCategory}
                    onStatusUpdateHandler={this._onApplicationStatusUpdate}
                    isUserAdmin={currentUser.privilege >= 10}
                    currentUserName={currentUser.name} />
                <PTOApplyModal
                    show={showPTOApplyModal}
                    onHideHandler={this._closePTOApplyModal}
                    onSubmitHandler={this._onPTOApplySubmitClicked}
                    onCancelHandler={this._closePTOApplyModal} />
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
    goToNextYear            : PropTypes.func
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
