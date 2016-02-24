// Styles
import './Job-Table.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import Table from '../A10UI/Table/Table';
import Td from '../A10UI/Table/Td';
import EditButton from '../A10UI/Button/EditButton';
import DeleteButton from '../A10UI/Button/DeleteButton';

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
			    className="job-table__header"
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

let TableBody = ({ data, titleKeyMap, onEditHandler, onDeleteHandler }) => {
	let bodyHtml = (
		<tr>
		    <Td
			    colSpan={titleKeyMap.length}
			    className="job-table__body--empty">
			    No Match Result!
			</Td>
		</tr>
	);

	if (data.length > 0) {
		bodyHtml = data.map((task, bodyIndex) => {
			const cellHtml = titleKeyMap.map((header, cellIndex) => {
				if (header['key'] === 'id') {
					return (
						<Td key={cellIndex}>
							<EditButton onClick={() => {onEditHandler(task[header['key']]);}} />
							<DeleteButton onClick={() => {onDeleteHandler(task[header['key']]);}} />
						</Td>
					);
				}
				return (
					<Td key={cellIndex}>{task[header['key']]}</Td>
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
		<tbody className="job-table__body">
		    {bodyHtml}
		</tbody>
	);
};

class JobTable extends Component {
	constructor(props) {
		super(props);
		this._onSortHandler = ::this._onSortHandler;
	}

	_onSortHandler(e) {
		const category = e.target.dataset.name;
		this.props.onSortHandler(category);
	}

	render () {
		return (
			<div className="job-table">
			    <Table>
				    <TableHeaders
				        {...this.props}
				        onSortHandler={this._onSortHandler} />
				    <TableBody {...this.props} />
				</Table>
			</div>
		);
	}
}

JobTable.propTypes = {
	data           : PropTypes.array.isRequired,
	titleKeyMap    : PropTypes.array.isRequired,
	enableSort     : PropTypes.bool,
	sortBy         : PropTypes.object,
	onSortHandler  : PropTypes.func,
	onEditHandler  : PropTypes.func,
	onDeleteHandler: PropTypes.func,
};

JobTable.defaultProps = {
	enableSort: false,
	sortBy: {
		category: '',
		status: 0
	},
	onSortHandler: () => {}
};

export default JobTable;
