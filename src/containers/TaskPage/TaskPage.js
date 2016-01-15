/**
 * @author Howard Chang
 */
// Style
import './_TaskPage';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Actions
import * as TaskPageActions from '../../actions/task-page-actions';
import * as mainActions from '../../actions/main-actions';
// Components
import FilterList from '../../components/Filter-List/Filter-List';
import StaticDataTable from '../../components/Static-Data-Table/Static-Data-Table.js';
import JobTable from '../../components/Job-Table/Job-Table.js';
import AlertBox from '../../components/AlertBox/AlertBox';
import EditFeatureModal from '../../components/EditFeatureModal/EditFeatureModal';

let FeatureTable = ({
	featureTableTitle,
	featureTableData,
	sortFeatureTableBy,
	featureTableOriginalData,
	featureTitleKeyMap,
	featureFilterConditions,
	sortFeatureTableByCategory,
	filterFeatureTable
}) => {
	return (
		<div className="task-page__feature-table">
		    <h5>{featureTableTitle}</h5>
		    <FilterList
		        data={featureTableOriginalData}
		        categories={Object.keys(featureFilterConditions)}
		        onFilterHandler={filterFeatureTable} />
		    <StaticDataTable
		        data={featureTableData}
		        titleKeyMap={featureTitleKeyMap}
		        enableSort
		        sortBy={sortFeatureTableBy}
		        onSortHandler={sortFeatureTableByCategory} />
		</div>
	);
};

let BugTable = ({
	bugTableTitle,
	bugTableData,
	sortBugTableBy,
	bugTableOriginalData,
	bugTitleKeyMap,
	bugFilterConditions,
	sortBugTableByCategory,
	filterBugTable
}) => {
	return (
		<div className="task-page__bug-table">
			<h5>{bugTableTitle}</h5>
		    <FilterList
		        data={bugTableOriginalData}
		        categories={Object.keys(bugFilterConditions)}
		        onFilterHandler={filterBugTable} />
		    <StaticDataTable
		        data={bugTableData}
		        titleKeyMap={bugTitleKeyMap}
		        enableSort
		        sortBy={sortBugTableBy}
		        onSortHandler={sortBugTableByCategory} />
		</div>
	);
};

let InternalFeatureTable = ({
	internalFeatureTableTitle,
	internalFeatureTableData,
	sortInternalFeatureTableBy,
	internalFeatureTableOriginalData,
	internalFeatureTitleKeyMap,
	internalFeatureFilterConditions,
	sortInternalFeatureTableByCategory,
	filterInternalFeatureTable,
	onDeleteClicked,
	onEditClicked
}) => {
	return (
		<div className="task-page__internal-feature-table">
			<h5>{internalFeatureTableTitle}</h5>
			<FilterList
		        data={internalFeatureTableOriginalData}
		        categories={Object.keys(internalFeatureFilterConditions)}
		        onFilterHandler={filterInternalFeatureTable} />
		    <JobTable
		        data={internalFeatureTableData}
		        titleKeyMap={internalFeatureTitleKeyMap}
		        enableSort
		        sortBy={sortInternalFeatureTableBy}
		        onSortHandler={sortInternalFeatureTableByCategory}
		        onEditHandler={onEditClicked}
		        onDeleteHandler={onDeleteClicked} />
		</div>
	);
};

let DeleteWarningBox = ({
	showDeleteWarning,
	deleteFeatureWarning,
	setDeleteWarningBoxState,
	onConfirmDeleteClicked
}) => {
	return (
		<AlertBox
			type="warning"
			show={showDeleteWarning}
			message={deleteFeatureWarning}
			onHideHandler={() => { setDeleteWarningBoxState(false); }}
			onConfirmHandler={onConfirmDeleteClicked}
			onCancelHandler={() => { setDeleteWarningBoxState(false); }} />
	);
};

class TaskPage extends Component {
	constructor(props) {
		super(props);
		this._onCrawlerButtonClicked = ::this._onCrawlerButtonClicked;
		this._onEditClicked = ::this._onEditClicked;
		this._onDeleteClicked = ::this._onDeleteClicked;
		this._onConfirmDeleteClicked = ::this._onConfirmDeleteClicked;
		this._onCreateButtonClicked = ::this._onCreateButtonClicked;
		this._onFeatureSubmitClicked = ::this._onFeatureSubmitClicked;
		this._closeFeatureModal = ::this._closeFeatureModal;
	}
	componentWillMount() {
		const { fetchTaskPageData } = this.props;
		fetchTaskPageData();
	}
	componentWillUnmount() {
		const { resetFeatureTable, resetBugTable, resetInternalFeatureTable } = this.props;
		resetFeatureTable();
		resetBugTable();
		resetInternalFeatureTable();
	}
	_onCrawlerButtonClicked() {
		const { initiateGK2Crawler } = this.props;
		initiateGK2Crawler();
	}
	_onDeleteClicked(id) {
		const { setDeleteWarningBoxState, setSelectedItem } = this.props;
		setDeleteWarningBoxState(true);
		setSelectedItem(id);
	}
	_onEditClicked(id) {
		const { setFeatureModalState, setSelectedItem } = this.props;
		setFeatureModalState(true);
		setSelectedItem(id);
	}
	_onCreateButtonClicked() {
		const { setFeatureModalState } = this.props;
		setFeatureModalState(true);
	}
	_onConfirmDeleteClicked() {
		const { selectedID, deleteSelectedItems } = this.props;
		deleteSelectedItems(selectedID);
	}
	_onFeatureSubmitClicked(data) {
		const { createFeature, updateFeature, selectedItem } = this.props;
		if (selectedItem.id) {
			updateFeature(selectedItem.id, data);
		} else {
			createFeature(data);
		}
	}
	_closeFeatureModal() {
		const { setFeatureModalState, resetSelectedItem } = this.props;
		setFeatureModalState(false);
		resetSelectedItem();
	}
	render() {
		const { formOptions, showFeatureModal, selectedItem } = this.props;
		return (
			<section className="task-page">
			    <button
			    	className="btn btn-success"
			        onClick={this._onCrawlerButtonClicked}>
			        Crawl GK2
			    </button>
			    <BugTable {...this.props} />
			    <FeatureTable {...this.props} />
			    <InternalFeatureTable
			    	onEditClicked={this._onEditClicked}
			    	onDeleteClicked={this._onDeleteClicked}
			        {...this.props} />
			    <DeleteWarningBox
			    	onConfirmDeleteClicked={this._onConfirmDeleteClicked}
			        {...this.props} />
			    <button
			    	className="btn btn-success"
			        onClick={this._onCreateButtonClicked}>
			        Create Feature
			    </button>
			    <EditFeatureModal
			        show={showFeatureModal}
			        data={selectedItem}
			        formOptions={formOptions}
			        onHideHandler={this._closeFeatureModal}
			        onSubmitHandler={this._onFeatureSubmitClicked}
					onCancelHandler={this._closeFeatureModal} />
			</section>
		);
	}
}

function mapStateToProps(state) {
	return state.task.toJS();
}

function mapDispatchToProps(dispatch) {
	return Object.assign(
		{},
		bindActionCreators(TaskPageActions, dispatch),
		{
			setLoadingState: (loadingState) => {
				dispatch(mainActions.setLoadingState(loadingState));
			}
		}
	);
}

TaskPage.propTypes = {
	bugTableTitle             : PropTypes.string,
	bugTableData              : PropTypes.array,
	sortBugTableBy            : PropTypes.object,
	bugTableOriginalData      : PropTypes.array,
	bugTitleKeyMap            : PropTypes.array,
	bugFilterConditions       : PropTypes.object,
	featureTableTitle         : PropTypes.string,
	featureTableData          : PropTypes.array,
	sortFeatureTableBy        : PropTypes.object,
	featureTableOriginalData  : PropTypes.array,
	featureTitleKeyMap        : PropTypes.array,
	featureFilterConditions   : PropTypes.object,
	internalFeatureTableTitle : PropTypes.string,
	deleteFeatureWarning      : PropTypes.string,
	selectedID                : PropTypes.array,
	formOptions               : PropTypes.object,
	selectedItem              : PropTypes.object,
	showDeleteWarning         : PropTypes.bool,
	showFeatureModal          : PropTypes.bool,
	sortFeatureTableByCategory: PropTypes.func,
	filterFeatureTable        : PropTypes.func,
	sortBugTableByCategory    : PropTypes.func,
	filterBugTable            : PropTypes.func,
	initiateGK2Crawler        : PropTypes.func,
	resetFeatureTable         : PropTypes.func,
	resetBugTable             : PropTypes.func,
	setLoadingState           : PropTypes.func,
	fetchTaskPageData         : PropTypes.func,
	resetInternalFeatureTable : PropTypes.func,
	setDeleteWarningBoxState  : PropTypes.func,
	setSelectedItem           : PropTypes.func,
	resetSelectedItem         : PropTypes.func,
	deleteSelectedItems       : PropTypes.func,
	setFeatureModalState      : PropTypes.func,
	createFeature             : PropTypes.func,
	updateFeature             : PropTypes.func
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TaskPage);
