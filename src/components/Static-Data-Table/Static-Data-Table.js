// Styles
import './Static-Data-Table.css';

// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import Table from '../A10UI/Table';

let TableHeaders = ({ titleKeyMap, onSortHandler, sortBy, enableSort }) => {
	let headerHtml = titleKeyMap.map((headerObj, index) => {
		let header = headerObj.title;
		const ascendingButtonClassNames = classnames('glyphicon glyphicon-menu-up', {
			'hide': sortBy.category !== header || sortBy.status !== 1
		});
		const descendingButtonClassNames = classnames('glyphicon glyphicon-menu-down', {
			'hide': sortBy.category !== header || sortBy.status !== -1
		});
		let filterIconHtml = (<span></span>);

		if (enableSort) {
			filterIconHtml = (
				<span data-name={header}>
					<i
					    className={ascendingButtonClassNames}
					    data-name={header}>
					</i>
					<i
					    className={descendingButtonClassNames}
					    data-name={header}>
					</i>
				</span>
			);
		}

		return (
			<th
			    key={index}
			    className="static-data-table__header"
			    data-name={header}
			    onClick={onSortHandler}>
			    <span data-name={header}>{header}</span>
			    {filterIconHtml}
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

let TableBody = ({ data, titleKeyMap }) => {
	let bodyHtml = (
		<tr>
		    <td
			    colSpan={titleKeyMap.length}
			    className="static-data-table__body--empty">
			    No Match Result!
			</td>
		</tr>
	);

	if (data.length > 0) {
		bodyHtml = data.map((task, bodyIndex) => {
			const cellHtml = titleKeyMap.map((header, cellIndex) => {
				return (
					<td key={cellIndex}>{task[header['key']]}</td>
				);
			});

			return (
				<tr key={bodyIndex}>
				    {cellHtml}
				</tr>
			);
		});
	}

	return (
		<tbody className="static-data-table__body">
		    {bodyHtml}
		</tbody>
	);
};

class StaticDataTable extends Component {
	constructor(props) {
		super(props);
		this._onSortHandler = ::this._onSortHandler;
	}

	_onSortHandler(e) {
		const category = e.target.dataset.name;
		this.props.onSortHandler(category);
	}

	render () {
		const { data, titleKeyMap, sortBy, enableSort } = this.props;

		return (
			<div className="static-data-table">
			    <Table>
				    <TableHeaders
				        titleKeyMap={titleKeyMap}
				        onSortHandler={this._onSortHandler}
				        enableSort={enableSort}
				        sortBy={sortBy} />
				    <TableBody
				        data={data}
				        titleKeyMap={titleKeyMap} />
				</Table>
			</div>
		);
	}
}

StaticDataTable.propTypes = {
	data         : PropTypes.array.isRequired,
	titleKeyMap  : PropTypes.array.isRequired,
	enableSort   : PropTypes.bool,
	sortBy       : PropTypes.object,
	onSortHandler: PropTypes.func
};

StaticDataTable.defaultProps = {
	enableSort: false,
	sortBy: {
		category: '',
		status: 0
	},
	onSortHandler: () => {}
};

export default StaticDataTable;
