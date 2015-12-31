// Styles
import './_Task-Table.scss';

// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

// Components
import InlineTableInputDatePicker from '../Inline-Table-Input-DatePicker/Inline-Table-Input-DatePicker';

let FilterIcons = ({ sortBy, onSortHandler, header, enableSort }) => {
	const buttonClassNames = classnames('mdl-button mdl-js-button mdl-button--icon', {
		'mdl-button--colored': sortBy.indexOf(header) >= 0
	});
	let filterIconHtml = (<div></div>);

	if (enableSort) {
		filterIconHtml = (
			<button
		        className={buttonClassNames}
		        data-name={header}
		        onClick={onSortHandler}>
			    <i className="material-icons" data-name={header}>sort</i>
			</button>
		);
	}

	return filterIconHtml;
};

let TableHeaders = ({ data, onSortHandler, sortBy, enableSort }) => {
	let headerHtml = Object.keys(data).map((header, index) => {
		return (
			<th key={index}>
			    {header}
			    <FilterIcons
			        sortBy={sortBy}
			        onSortHandler={onSortHandler}
			        header={header}
			        enableSort={enableSort} />
			</th>
		);
	});
	return (
		<thead>
		    <tr>
		        {headerHtml}
		    </tr>
		</thead>
	);
};

let TableBody = ({ data, onETASubmitHandler }) => {
	const bodyHtml = data.map((task, bodyIndex) => {
		const isBodyEmpty = Object.keys(data[0]).every((key) => { return !task[key]; });
		const tableLength = Object.keys(data[0]).length;
		const curriedSubmitHandler = (eta) => {
			onETASubmitHandler(task['ID'], eta);
		};
		let cellHtml = (
			<td
			    colSpan={tableLength}
			    className="task-table__body--empty">
			    No Match Result!
			</td>
		);

		if (!isBodyEmpty) {
			cellHtml = Object.keys(data[0]).map((key, cellIndex) => {
				let tableData;
				switch (key) {
					case 'ETA':
						tableData = (
							<InlineTableInputDatePicker
							    key={cellIndex}
							    defaultData={task[key]}
							    onSubmitHandler={curriedSubmitHandler} />
						);
					break;
					default:
						tableData = (
							<td key={cellIndex}>{task[key]}</td>
						);
				}
				return tableData;
			});
		}

		return (
			<tr key={bodyIndex}>
			    {cellHtml}
			</tr>
		);
	});
	return (
		<tbody className="task-table__body">
		    {bodyHtml}
		</tbody>
	);
};

class TaskTable extends Component {
	constructor(props) {
		super(props);
		this._onSortHandler = ::this._onSortHandler;
	}

	componentWillUnmount() {
		this.props.onUnmountHandler();
	}

	_onSortHandler(e) {
		const {
			onSortHandler,
		} = this.props;
		const category = e.target.dataset.name;

		onSortHandler(category);
	}

	render () {
		const { data, sortBy, enableSort, onETASubmitHandler } = this.props;

		return (
			<div className="task-table">
			    <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
				    <TableHeaders
				        data={data[0]}
				        onSortHandler={this._onSortHandler}
				        enableSort={enableSort}
				        sortBy={sortBy} />
				    <TableBody
				        data={data}
				        onETASubmitHandler={onETASubmitHandler} />
				</table>
			</div>
		);
	}
}

TaskTable.propTypes = {
	data              : PropTypes.array.isRequired,
	enableSort        : PropTypes.bool,
	sortBy            : PropTypes.array,
	onSortHandler     : PropTypes.func,
	onUnmountHandler  : PropTypes.func,
	onETASubmitHandler: PropTypes.func
};

TaskTable.defaultProps = {
	enableSort        : false,
	sortBy            : [],
	onSortHandler     : () => {},
	onUnmountHandler  : () => {},
	onETASubmitHandler: () => {}
};

export default TaskTable;
