// Styles
import './_Bugs-Table.scss';

// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

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

let TableBody = ({ data }) => {
	const bodyHtml = data.map((bug, bodyIndex) => {
		const isBodyEmpty = Object.keys(data[0]).every((key) => { return !bug[key]; });
		const tableLength = Object.keys(data[0]).length;
		let cellHtml = (
			<td
			    colSpan={tableLength}
			    className="bugs-table__body--empty">
			    No Match Result!
			</td>
		);

		if (!isBodyEmpty) {
			cellHtml = Object.keys(data[0]).map((key, cellIndex) => {
				return (
					<td key={cellIndex}>{bug[key]}</td>
				);
			});
		}

		return (
			<tr key={bodyIndex}>
			    {cellHtml}
			</tr>
		);
	});
	return (
		<tbody className="bugs-table__body">
		    {bodyHtml}
		</tbody>
	);
};

class BugsTable extends Component {
	constructor(props) {
		super(props);
		this._onSortHandler = this._onSortHandler.bind(this);
		this._onFilterHandler = this._onFilterHandler.bind(this);
		this._renderFilterByType = this._renderFilterByType.bind(this);
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
			onFilterHandler
		} = this.props;
		let filterConditions = {
			'Developer': this.refs.developerFilter.value,
			'PRI': this.refs.priFilter.value,
			'Project': this.refs.projectFilter.value,
		};

		onFilterHandler(filterConditions);
	}

	_renderFilterByType(type) {
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
			<span className="bugs-table-filters__filter">
				<span>{type}: </span>
				<select ref={`${lowerCaseType}Filter`} onChange={this._onFilterHandler}>
					<option value={''}>All</option>
					{optionsHtml}
				</select>
			</span>
		);
	}

	render () {
		const { data, sortBy, enableSort } = this.props;
		const devFilter = this._renderFilterByType('Developer');
		const priFilter = this._renderFilterByType('PRI');
		const projFilter = this._renderFilterByType('Project');

		return (
			<div className="bugs-table">
			    <h5>Bugs Table</h5>
			    <div className="bugs-table-filters">
			    	{devFilter}
			    	{priFilter}
			    	{projFilter}
			    </div>
			    <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
				    <TableHeaders
				        data={data[0]}
				        onSortHandler={this._onSortHandler}
				        enableSort={enableSort}
				        sortBy={ sortBy } />
				    <TableBody data={data} />
				</table>
			</div>
		);
	}
}

BugsTable.propTypes = {
	data: PropTypes.array.isRequired,
	originalData: PropTypes.array.isRequired,
	enableSort: PropTypes.bool,
	sortBy: PropTypes.array,
	onSortHandler: PropTypes.func,
	onFilterHandler: PropTypes.func,
	onUnmountHandler: PropTypes.func
};

BugsTable.defaultProps = {
	enableSort: false,
	sortBy: [],
	onSortHandler: () => {},
	onFilterHandler: () => {},
	onUnmountHandler: () => {}
};

export default BugsTable;
