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
import PTOApplyModal from '../../components/PTO-Apply-Modal/PTO-Apply-Modal';

class PTOPage extends Component {
    constructor(props) {
        super(props);
        this._onApplyButtonClicked = ::this._onApplyButtonClicked;
        this._onPTOApplySubmitClicked = ::this._onPTOApplySubmitClicked;
        this._closePTOApplyModal = ::this._closePTOApplyModal;
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
        const { createPTOApplication, setPTOApplyModalState, setLoadingState } = this.props;
        let finalData = {
            start_date: data.startDate,
            end_date: data.endDate,
            memo: data.memo,
            hours: data.hours,
            apply_date: moment().format('YYYY-MM-DD'),
            applicant: 'Tester',
            status: PTOConstants.PENDING
        };
        setPTOApplyModalState(false);
        setLoadingState(true);
        createPTOApplication(
            finalData,
            () => {
                setLoadingState(false);
                this._closePTOApplyModal();
            }
        );
    }
    render() {
        const { showPTOApplyModal } = this.props;
        return (
            <section>
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
    showPTOApplyModal: PropTypes.bool,
    setPTOApplyModalState: PropTypes.func,
    setLoadingState: PropTypes.func,
    createPTOApplication: PropTypes.func
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
