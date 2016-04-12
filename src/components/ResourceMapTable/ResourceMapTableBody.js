import './ResourceMapTable.css';

import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import ResourceMapCellAddButton from './ResourceMapCellAddButton.js';
import ResourceMapCellPto from './ResourceMapCellPto.js';
import ResourceMapCellWorkLog from './ResourceMapCellWorkLog.js';

import Td from '../A10-UI/Table/Td';


const RESOURCE_MAP_CELLS = {
    defaults: (config, onModalHander) => {
        return (
            <ResourceMapCellAddButton
                config={config}
                onModalHander={onModalHander}
            />
        );
    },
    pto: () => {
        return (<ResourceMapCellPto />);
    },
    log: (config) => {
        return (
            <ResourceMapCellWorkLog
                config={config}
            />
        );
    }
};

const RESOURCE_MAP_CELLS_DEFAULT_TYPE = 'defaults';

class ResourceMapTableBody extends Component {

    constructor() {
        super();
        this._onShowModalHandler = ::this._onShowModalHandler;
    }

    _onShowModalHandler() {
        const { onModalHander } = this.props;
        onModalHander(true);
    }

	render() {
		const {data, startDate, onModalHander} = this.props;
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
                var user = resource.name;
                let userHtml = (<Td key={0} colSpan={1} className={'cell-layout-style'}>{user}</Td>);
                let itemsHtml = items.map((itemValue, itemIndex) => {
                    let currentDay = moment(startDate).add(itemIndex, 'days');
                    let day = currentDay.isoWeekday();
                    let className = 'cell-layout-style ';
                    if (day === 6 || day === 7) {
                        className += 'weekend-style';
                    }
                    let item = itemValue.item;
                    let cellFunc = undefined;
                    let config = {};
                    var cellHtml = '';
                    if (item != null) {
                        let type = item.type;
                        config = item ;
                        cellFunc = RESOURCE_MAP_CELLS[type];
                    }
                    config.user = user;
                    config.date = currentDay;
                    if (cellFunc !== undefined) {
                        cellHtml = cellFunc(config);
                    }
                    var defaultCellHtml = RESOURCE_MAP_CELLS[ RESOURCE_MAP_CELLS_DEFAULT_TYPE ](config, onModalHander);

                    return (
                        <Td
                            key={itemIndex + 1}
                            colSpan={1}
                            className={className}
                        >
                            {defaultCellHtml}
                            {cellHtml}
                        </Td>
                    );
                });
                itemsHtml.unshift(userHtml);
                return (
                    <tr className={'table-tr'} key={bodyIndex}>{itemsHtml}</tr>
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
	data:  PropTypes.array.isRequired,
    onModalHander: PropTypes.func.isRequired
};

export default ResourceMapTableBody;