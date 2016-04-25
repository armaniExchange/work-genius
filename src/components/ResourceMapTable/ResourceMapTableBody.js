import './ResourceMapTable.css';
import './_color.css';
import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import ResourceMapCellAddButton from './ResourceMapCellAddButton.js';
import ResourceMapCellPto from './ResourceMapCellPto.js';
import ResourceMapCellWorkLog from './ResourceMapCellWorkLog.js';
import ResourceMapCellHoliday from './ResourceMapCellHoliday.js';

import Td from '../A10-UI/Table/Td';

const RESOURCE_MAP_CELLS = {
    defaults: (config, onModalHander) => {
        return (
            <ResourceMapCellAddButton
                config={config}
                onModalHander={onModalHander}
            />
        );
        // return (<div/>);
    },
    pto: () => {
        return (<ResourceMapCellPto />);
    },
    workday: (config, onModalHander, onSubmitStatus, onDeleteItemHander) => {
        return (
            <ResourceMapCellWorkLog
                config={config}
                onModalHander={onModalHander}
                onSubmitStatus={onSubmitStatus}
                onDeleteItemHander={onDeleteItemHander}
            />
        );
    },
    holiday: (config) => {
        // return (
        //     <ResourceMapCellWorkLog
        //         config={config}
        //         className={'holiday-style'}
        //         onModalHander={onModalHander}
        //         onSubmitStatus={onSubmitStatus}
        //         onDeleteItemHander={onDeleteItemHander}
        //     />
        // );
        return (<ResourceMapCellHoliday config={config} />);
    }
};

// const RESOURCE_MAP_CELLS_DEFAULT_TYPE = 'defaults';

class ResourceMapTableBody extends Component {

    constructor() {
        super();
        this._onShowModalHandler = ::this._onShowModalHandler;
    }

    _onShowModalHandler(config) {
        const { onModalHander } = this.props;
        onModalHander(true, config);
    }

	render() {
		const {data, startDate, totalDays, onModalHander, onSubmitStatus, onDeleteItemHander} = this.props;
		let bodyHtml = (
            <tr>
                <Td
                    colSpan={ totalDays + 1 }
                    className="table_header_style">
                    No Match Result!
                </Td>
            </tr>
        );
        if (data.length > 0) {
            // var moreItems = {};
        	bodyHtml = data.map((resource, bodyIndex) => {
                let worklogs = resource.worklogs;
                var user = resource.name;
                var userId = resource.id;
                let userHtml = (<Td key={0} colSpan={1} className={'cell-layout-style'}>{user}</Td>);
                let itemsHtml = worklogs.map((itemValue, itemIndex) => {
                    // If the day is weekday, will be show weekday style.
                    let currentDay = moment(startDate).add(itemIndex, 'days');

                    // Got work log items, and show item cells.
                    // let item = itemValue.worklog_items;
                    let cellFunc = undefined; // Different cell function, show different style.
                    // let config = {};    // The cell need config.
                    var cellHtml = '';  // The style of final.
                        let type = itemValue.day_type;
                    if (RESOURCE_MAP_CELLS.hasOwnProperty(type)) {
                        cellFunc = RESOURCE_MAP_CELLS[type];
                    }
                    // cellFunc = RESOURCE_MAP_CELLS[type];
                    // if (type != null) {
                    //     config = itemValue;
                    //     cellFunc = RESOURCE_MAP_CELLS[type];
                    // }
                    itemValue.user = user;
                    itemValue.userId = userId;
                    itemValue.date = currentDay;
                    if (cellFunc !== undefined) {
                        cellHtml = cellFunc(itemValue, onModalHander, onSubmitStatus, onDeleteItemHander);
                    }
                    // var defaultCellHtml = RESOURCE_MAP_CELLS[ RESOURCE_MAP_CELLS_DEFAULT_TYPE ](config, onModalHander);

                    let __onShowModalHandler = () => {
                        this._onShowModalHandler(itemValue);
                    };

                    // let day = currentDay.isoWeekday();
                    let className = 'cell-layout-style';
                    // if (day === 6 || day === 7) {
                    //     className += '__weekday';
                    // } else
                    if (type === 'pto') {
                        className += '__pto';
                    } else if (type === 'holiday') {
                        className += '__holiday';
                    }

                    return (
                        <Td
                            key={itemIndex + 1}
                            colSpan={1}
                            className={className}
                            onClick={__onShowModalHandler}
                        >
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
    totalDays: PropTypes.number.isRequired,
	data:  PropTypes.array.isRequired,
    onModalHander: PropTypes.func.isRequired,
    onSubmitStatus: PropTypes.func.isRequired,
    onDeleteItemHander: PropTypes.func.isRequired
};

ResourceMapTableBody.defaultProps = {
    totalDays: 7
};

export default ResourceMapTableBody;