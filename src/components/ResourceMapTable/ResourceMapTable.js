
import React, { Component, PropTypes } from 'react';

// Constants
import Table from '../A10-UI/Table/Table';

import ResourceMapTableHeader from './ResourceMapTableHeader.js';
import ResourceMapTableBody from './ResourceMapTableBody.js';
import ResourceMapModalWorkLog from './ResourceMapModalWorkLog.js';

class ResourceMapTable extends Component {

	render() {

		const {
			startDate,
			totalDays,
			data,
			show,
			onModalHander,
            upsertWorklogItem,
            defaultModalInfos
		} = this.props;
		return (
			<div>
				<Table className="bug-review-table">
					<ResourceMapTableHeader
						startDate={startDate}
						totalDays={totalDays}
					/>
					<ResourceMapTableBody data={data} startDate={startDate} onModalHander={onModalHander}/>
                </Table>
                <ResourceMapModalWorkLog
                	show={show}
                	onModalHander={onModalHander}
                    onModalSubmit={upsertWorklogItem}
                    defaultModalInfos={defaultModalInfos}
                />
            </div>
        );
	};
}

ResourceMapTable.propTypes = {
    startDate          : PropTypes.string.isRequired,
    totalDays          : PropTypes.number.isRequired,
    show               : PropTypes.bool.isRequired,
    data               : PropTypes.array.isRequired,
    defaultModalInfos  : PropTypes.object.isRequired,
    upsertWorklogItem  : PropTypes.func.isRequired,
    onModalHander      : PropTypes.func.isRequired
};

ResourceMapTable.defaultProps = {
	startDate          : new Date(),
	totalDays          : 10,
	show               : false,
	data               : [],
    defaultModalInfos  : {}
};

export default ResourceMapTable;