// Styles
import './_Task-Table.scss';

// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

// Components
import InlineTableInput from '../Inline-Table-Input/Inline-Table-Input';

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
							<InlineTableInput
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
		this._onFilterHandler = ::this._onFilterHandler;
		this._renderFilterByType = ::this._renderFilterByType;
		this._renderFilter = ::this._renderFilter;
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

	_onFilterHandler() {
		const {
			onFilterHandler,
			filterBy
		} = this.props;
		let filterConditions = {};

		filterBy.forEach((name) => {
			filterConditions[name] = this.refs[`${name.toLowerCase()}Filter`].value;
		});

		onFilterHandler(filterConditions);
	}

	_renderFilterByType(type, keyName) {
		const { originalData } = this.props;
		let lowerCaseType = type.toLowerCase();
		let options = [];
		let optionsHtml = originalData.map((bug, i) => {
			if (options.indexOf(bug[type]) < 0) {
				options.push(bug[type]);
				return (
					<option value={bug[type]} key={i}>{bug[type]}</option>
				);
			}
			return null;
		});

		return (
			<span className="task-table-filters__filter" key={keyName}>
				<span>{type}: </span>
				<select ref={`${lowerCaseType}Filter`} onChange={this._onFilterHandler}>
					<option value={''}>All</option>
					{optionsHtml}
				</select>
			</span>
		);
	}

	_renderFilter() {
		const { filterBy } = this.props;
		return filterBy.map((filterName, i) => {
			return this._renderFilterByType(filterName, i);
		});
	}

	render () {
		const { data, sortBy, enableSort, tableTitle, onETASubmitHandler } = this.props;

		return (
			<div className="task-table">
			    <h5>{tableTitle}</h5>
			    <div className="task-table-filters">
			    	{this._renderFilter()}
			    </div>
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
	data: PropTypes.array.isRequired,
	originalData: PropTypes.array.isRequired,
	tableTitle: PropTypes.string.isRequired,
	enableSort: PropTypes.bool,
	sortBy: PropTypes.array,
	filterBy: PropTypes.array,
	onSortHandler: PropTypes.func,
	onFilterHandler: PropTypes.func,
	onUnmountHandler: PropTypes.func,
	onETASubmitHandler: PropTypes.func
};

TaskTable.defaultProps = {
	enableSort: false,
	sortBy: [],
	filterBy: [],
	onSortHandler: () => {},
	onFilterHandler: () => {},
	onUnmountHandler: () => {},
	onETASubmitHandler: () => {}
};

export default TaskTable;
