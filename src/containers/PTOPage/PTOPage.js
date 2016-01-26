// Style
import './_PTOPage';
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
// Components
import FilterList from '../../components/Filter-List/Filter-List';
import PTOApplyModal from '../../components/PTO-Apply-Modal/PTO-Apply-Modal';
import PTOTable from '../../components/PTO-Table/PTO-Table.js';
import NameFilterGroup from '../../components/Name-Filter-Group/Name-Filter-Group.js';

let PTOYearFilter = ({ selectedYear, goToPreviousYear, goToNextYear }) => {
    return (
        <div className="pto-year-filter">
            <button
                className="btn btn-success"
                onClick={goToPreviousYear}>
                -
            </button>
            <span>{selectedYear}</span>
            <button
                className="btn btn-success"
                onClick={goToNextYear}>
                +
            </button>
        </div>
    );
};

class PTOPage extends Component {
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
        const { fetchPTOPageData, currentUser, selectedYear } = this.props;
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
    _onApplicationStatusUpdate(id, newState) {
        const { setPTOApplicationStatus } = this.props;
        setPTOApplicationStatus(id, newState);
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
            currentSelectedUserID,
            applicationsOriginalData,
            filterPTOTable,
            sortPTOTableByCategory,
            sortPTOTableBy
        } = this.props;

        return (
            <section>
                <PTOYearFilter {...this.props} />
                <NameFilterGroup
                    users={allUsersWithClosestPTO}
                    currentSelectedUserID={currentSelectedUserID}
                    onUserClickedHandler={this._onUserFilterClickedHandler} />
                <FilterList
                    data={applicationsOriginalData}
                    categories={ptoFilterConditions}
                    onFilterHandler={filterPTOTable} />
                <PTOTable
                    data={applications}
                    titleKeyMap={ptoTitleKeyMap}
                    enableSort={true}
                    sortBy={sortPTOTableBy}
                    onSortHandler={sortPTOTableByCategory}
                    onStatusUpdateHandler={this._onApplicationStatusUpdate}
                    onDeleteHandler={this._onPTORemoveClicked} />
                <button
                    className="btn btn-success"
                    onClick={this._onApplyButtonClicked}>
                    PTO Application
                </button>
                <PTOApplyModal
                    show={showPTOApplyModal}
                    onHideHandler={this._closePTOApplyModal}
                    onSubmitHandler={this._onPTOApplySubmitClicked}
                    onCancelHandler={this._closePTOApplyModal} />
            </section>
        );
    }
}

PTOPage.propTypes = {
    applications            : PropTypes.array,
    ptoTitleKeyMap          : PropTypes.array,
    applicationsOriginalData: PropTypes.array,
    allUsersWithClosestPTO  : PropTypes.array,
    showPTOApplyModal       : PropTypes.bool,
    ptoFilterConditions     : PropTypes.object,
    sortPTOTableBy          : PropTypes.object,
    currentUser             : PropTypes.object,
    currentSelectedUserID   : PropTypes.string,
    selectedYear            : PropTypes.number,
    setPTOApplyModalState   : PropTypes.func,
    setLoadingState         : PropTypes.func,
    getCurrentUser          : PropTypes.func,
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
)(PTOPage);
