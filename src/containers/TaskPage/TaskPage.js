// Style
import './_TaskPage';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Actions
import * as TaskPageActions from '../../actions/task-page-actions';
// Components
import FilterList from '../../components/Filter-List/Filter-List';
import StaticDataTable from '../../components/Static-Data-Table/Static-Data-Table.js';

class TaskPage extends Component {
	constructor(props) {
		super(props);
		this._onCrawlerButtonClicked = ::this._onCrawlerButtonClicked;
	}
	componentWillMount() {
		const { fetchBug, fetchFeature } = this.props.taskPageActions;
		fetchFeature();
		fetchBug();
	}
	componentWillUnmount() {
		const {
			resetFeatureTable,
			resetBugTable
		} = this.props.taskPageActions;
		resetFeatureTable();
		resetBugTable();
	}
	_onCrawlerButtonClicked() {
		const {
			initiateGK2Crawler
		} = this.props.taskPageActions;
		initiateGK2Crawler();
	}
	render() {
		const {
			bugTableTitle,
			bugTableData,
			sortBugTableBy,
			bugTableOriginalData,
			bugTitleKeyMap,
			bugFilterConditions,
			featureTableTitle,
			featureTableData,
			sortFeatureTableBy,
			featureTableOriginalData,
			featureTitleKeyMap,
			featureFilterConditions,
		} = this.props.taskPageState;
		const {
			sortFeatureTableByCategory,
			filterFeatureTable,
			sortBugTableByCategory,
			filterBugTable
		} = this.props.taskPageActions;

		return (
			<section className="task-page">
			    <button
			    	className="btn btn-success"
			        onClick={this._onCrawlerButtonClicked}>
			        Crawl GK2
			    </button>
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
			</section>
		);
	}
}

TaskPage.propTypes = {
	taskPageState: PropTypes.object.isRequired,
	taskPageActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return {
		taskPageState: state.task.toJS()
	};
}

function mapDispatchToProps(dispatch) {
	return {
		taskPageActions: bindActionCreators(TaskPageActions, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TaskPage);
