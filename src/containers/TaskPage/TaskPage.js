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
	internalFeatureTableTitle
}) => {
	return (
		<div className="task-page__internal-feature-table">
			<h5>{internalFeatureTableTitle}</h5>
		</div>
	);
};

class TaskPage extends Component {
	constructor(props) {
		super(props);
		this._onCrawlerButtonClicked = ::this._onCrawlerButtonClicked;
	}
	componentWillMount() {
		const { fetchTaskPageData, setLoadingState } = this.props;
		setLoadingState(true);
		fetchTaskPageData(
			() => setLoadingState(false)
		);
	}
	componentWillUnmount() {
		const { resetFeatureTable, resetBugTable } = this.props;
		resetFeatureTable();
		resetBugTable();
	}
	_onCrawlerButtonClicked() {
		const { initiateGK2Crawler, setLoadingState } = this.props;
		setLoadingState(true);
		initiateGK2Crawler(
			() => setLoadingState(false)
		);
	}
	render() {
		return (
			<section className="task-page">
			    <button
			    	className="btn btn-success"
			        onClick={this._onCrawlerButtonClicked}>
			        Crawl GK2
			    </button>
			    <BugTable {...this.props} />
			    <FeatureTable {...this.props} />
			    <InternalFeatureTable {...this.props} />
			</section>
		);
	}
}

function mapStateToProps(state) {
	return state.task.toJS();
}

function mapDispatchToProps(dispatch) {
	return Object.assign({},
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
	sortFeatureTableByCategory: PropTypes.func,
	filterFeatureTable        : PropTypes.func,
	sortBugTableByCategory    : PropTypes.func,
	filterBugTable            : PropTypes.func,
	initiateGK2Crawler        : PropTypes.func,
	resetFeatureTable         : PropTypes.func,
	resetBugTable             : PropTypes.func,
	setLoadingState           : PropTypes.func,
	fetchTaskPageData         : PropTypes.func
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TaskPage);
