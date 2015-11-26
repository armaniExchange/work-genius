// Style
import './_TaskPage';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Actions
import * as TaskPageActions from '../../actions/task-page-actions';
// Components
import TaskTable from '../../components/Task-Table/Task-Table';
import Spinner from '../../components/Spinner/Spinner';

class TaskPage extends Component {
	componentWillMount() {
		const { fetchBug, fetchFeature } = this.props.taskPageActions;
		fetchFeature();
		fetchBug();
	}
	render() {
		const {
			bugTableTitle,
			bugTableData,
			sortBugTableBy,
			bugTableOriginalData,
			isLoading,
			featureTableTitle,
			featureTableData,
			sortFeatureTableBy,
			featureTableOriginalData,
			featureFilterConditions,
			bugFilterConditions
		} = this.props.taskPageState;
		const {
			sortFeatureTableByCategory,
			filterFeatureTable,
			resetFeatureTable,
			sortBugTableByCategory,
			filterBugTable,
			resetBugTable,
			editETA
		} = this.props.taskPageActions;

		return (
			<section className="task-page">
				<Spinner hide={!isLoading} />
			    <span>Task Page</span>
			    <TaskTable
			        data={featureTableData}
			        originalData={featureTableOriginalData}
			        tableTitle={featureTableTitle}
			        enableSort
			        sortBy={sortFeatureTableBy}
			        filterBy={Object.keys(featureFilterConditions)}
			        onSortHandler={sortFeatureTableByCategory}
			        onFilterHandler={filterFeatureTable}
			        onUnmountHandler={resetFeatureTable}
			        onETASubmitHandler={editETA} />
			    <TaskTable
			        data={bugTableData}
			        originalData={bugTableOriginalData}
			        tableTitle={bugTableTitle}
			        enableSort
			        sortBy={sortBugTableBy}
			        filterBy={Object.keys(bugFilterConditions)}
			        onSortHandler={sortBugTableByCategory}
			        onFilterHandler={filterBugTable}
			        onUnmountHandler={resetBugTable}
			        onETASubmitHandler={editETA} />
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
