
import React, { Component, PropTypes } from 'react';

// Constants
import Table from '../A10-UI/Table/Table';

import ResourceMapTableHeader from './ResourceMapTableHeader.js';
import ResourceMapTableBody from './ResourceMapTableBody';

class ResourceMapTable extends Component {

	render() {

		const {
			startDate,
			totalDays,
			data
		} = this.props;

		return (
			<div>
				<Table className="bug-review-table">
					<ResourceMapTableHeader
						startDate={startDate}
						totalDays={totalDays}
					/>
					<ResourceMapTableBody data={data} startDate={startDate}/>
                </Table>
            </div>
        );
	};
}

ResourceMapTable.propTypes = {
    startDate          : PropTypes.string.isRequired,
    totalDays          : PropTypes.number.isRequired,
    data               : PropTypes.array.isRequired
};

ResourceMapTable.defaultProps = {
	startDate: new Date(),
	totalDays: 10,
	data:[]
};

export default ResourceMapTable;