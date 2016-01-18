// Style
import './_PTOPage';
// Libraries
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
// Actions
import * as PTOActions from '../../actions/pto-page-actions';
import * as mainActions from '../../actions/main-actions';
// Constants
import * as PTOConstants from '../../constants/pto-constants';
// Components
import FilterList from '../../components/Filter-List/Filter-List';
import PTOApplyModal from '../../components/PTO-Apply-Modal/PTO-Apply-Modal';
import PTOTable from '../../components/PTO-Table/PTO-Table.js';

class PTOPage extends Component {
    constructor(props) {
        super(props);
        this._onApplyButtonClicked = ::this._onApplyButtonClicked;
        this._onPTOApplySubmitClicked = ::this._onPTOApplySubmitClicked;
        this._closePTOApplyModal = ::this._closePTOApplyModal;
        this._onPTORemoveClicked = ::this._onPTORemoveClicked;
        this._onApplicationStatusUpdate = ::this._onApplicationStatusUpdate;
    }
    componentWillMount() {
        const { fetchPTOApplications } = this.props;
        fetchPTOApplications();
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
        const { createPTOApplication } = this.props;
        let finalData = {
            start_date: data.startDate,
            end_date: data.endDate,
            memo: data.memo,
            hours: data.hours,
            apply_date: moment().format('YYYY-MM-DD'),
            applicant: 'Tester',
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
    render() {
        const {
            showPTOApplyModal,
            applications,
            ptoTitleKeyMap,
            ptoFilterConditions,
            applicationsOriginalData,
            filterPTOTable,
            sortPTOTableByCategory,
            sortPTOTableBy
        } = this.props;

        return (
            <section>
                <FilterList
                    data={applicationsOriginalData}
                    categories={Object.keys(ptoFilterConditions)}
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
    applications: PropTypes.array.isRequired,
    ptoTitleKeyMap: PropTypes.array.isRequired,
    applicationsOriginalData: PropTypes.array,
    showPTOApplyModal: PropTypes.bool,
    ptoFilterConditions: PropTypes.object,
    sortPTOTableBy: PropTypes.object,
    setPTOApplyModalState: PropTypes.func,
    setLoadingState: PropTypes.func,
    createPTOApplication: PropTypes.func,
    filterPTOTable: PropTypes.func,
    sortPTOTableByCategory: PropTypes.func,
    setPTOApplicationStatus: PropTypes.func,
    removePTOApplication: PropTypes.func,
    fetchPTOApplications: PropTypes.func
};

function mapStateToProps(state) {
    return state.pto.toJS();
}

function mapDispatchToProps(dispatch) {
    return Object.assign(
        {},
        bindActionCreators(PTOActions, dispatch),
        {
            setLoadingState: (loadingState) => {
                dispatch(mainActions.setLoadingState(loadingState));
            }
        }
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PTOPage);
