import './ResourceMapTable.css';

import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import ResourceMapCellAddButton from './ResourceMapCellAddButton.js';
import ResourceMapCellPto from './ResourceMapCellPto.js';
import ResourceMapCellWorkLog from './ResourceMapCellWorkLog.js';

import Td from '../A10-UI/Table/Td';


const RESOURCE_MAP_CELLS = {
    defaults: () => {
        return (<ResourceMapCellAddButton />);
    },
    pto: () => {
        return (<ResourceMapCellPto />);
    },
    log: () => {
        return (<ResourceMapCellWorkLog />);
    }
};

const RESOURCE_MAP_CELLS_DEFAULT_TYPE = 'defaults';

class ResourceMapTableBody extends Component {

	render() {
		const {data, startDate} = this.props;
		console.log(data);
		let bodyHtml = (
            <tr>
                <Td
                    colSpan={15}
                    className="pto-table__body--empty">
                    No Match Result!
                </Td>
            </tr>
        );
        if (data.length > 0) {
        	bodyHtml = data.map((resource, bodyIndex) => {
                let items = resource.items;
                let userHtml = (<Td key={0} colSpan={1} className={'cell-layout-style'}>{resource.name}</Td>);
                let itemsHtml = items.map((itemValue, itemIndex) => {
                    console.log(startDate, itemIndex);
                    let day = moment(startDate).add(itemIndex, 'days').isoWeekday();
                    let className = 'cell-layout-style ';
                    if (day === 6 || day === 7) {
                        className += 'weekend-style';
                    }
                    console.log(day);
                    let item = itemValue.item;
                    let cellFunc = undefined;
                    let config = {};
                    if (item != null) {
                        let type = item.type;
                        config = item;
                        cellFunc = RESOURCE_MAP_CELLS[type];
                    }
                    if (cellFunc === undefined) {
                        cellFunc = RESOURCE_MAP_CELLS[ RESOURCE_MAP_CELLS_DEFAULT_TYPE ];
                    }

                    let cellHtml = cellFunc(config);

                    return (<Td key={itemIndex + 1} colSpan={1} className={className}>{cellHtml}</Td>);
                });
                itemsHtml.unshift(userHtml);
                return (
                    <tr key={bodyIndex}>{itemsHtml}</tr>
                );
        	});
        }
		return (
			<tbody className="pto-table__body">
				{bodyHtml}
            </tbody>
		);
	}

}

ResourceMapTableBody.propTypes = {
    startDate: PropTypes.string.isRequired,
	data:  PropTypes.array.isRequired
};

export default ResourceMapTableBody;