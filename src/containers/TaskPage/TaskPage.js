// Style
import './_TaskPage';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Actions
import * as TaskPageActions from '../../actions/task-page-actions';
// Components
import BugsTable from '../../components/Bugs-Table/Bugs-Table';
import Spinner from '../../components/Spinner/Spinner';

class TaskPage extends Component {
	componentWillMount() {
		const { fetchTasks } = this.props.taskPageActions;
		fetchTasks();
	}
	render() {
		const { bugsTableData, sortBy, bugsTableOriginalData, isLoading } = this.props.taskPageState;
		const { sortBugTableByCategory, filterBugTable, resetBugTable } = this.props.taskPageActions;

		return (
			<section className="task-page">
				<Spinner hide={!isLoading} />
			    <span>Task Page</span>
			    <BugsTable
			        data={bugsTableData}
			        originalData={bugsTableOriginalData}
			        enableSort
			        sortBy= {sortBy}
			        onSortHandler={sortBugTableByCategory}
			        onFilterHandler={filterBugTable}
			        onUnmountHandler={resetBugTable} />
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
