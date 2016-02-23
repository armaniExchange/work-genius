// Styles
import './PTO-Table.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
// Constants
import * as PTOConstants from '../../constants/pto-constants';
import Table from '../A10UI/Table';
import Th from '../A10UI/Th';
import Td from '../A10UI/Td';

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
            <Th
                key={index}
                className="pto-table__header"
                data-name={header}
                onClick={onSortHandler}>
                <span data-name={header}>{header}</span>
                {filterIconHtml}
            </Th>
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

let TableBody = ({ data, titleKeyMap, onStatusUpdateHandler, onDeleteHandler }) => {
    let bodyHtml = (
        <tr>
            <Td
                colSpan={titleKeyMap.length}
                className="pto-table__body--empty">
                No Match Result!
            </Td>
        </tr>
    );

    if (data.length > 0) {
        bodyHtml = data.map((task, bodyIndex) => {
            const cellHtml = titleKeyMap.map((header, cellIndex) => {
                let statusHTML;
                if (header['key'] === 'id') {
                    return (
                        <Td key={cellIndex}>
                            <button onClick={() => {onDeleteHandler(task[header['key']]);}}>
                                <i className="glyphicon glyphicon-trash"></i>
                            </button>
                        </Td>
                    );
                } else if (header['key'] === 'status') {
                    if (task[header['key']] === PTOConstants.APPROVED) {
                        statusHTML = (
                            <Td key={cellIndex}>Approved</Td>
                        );
                    } else if (task[header['key']] === PTOConstants.DENIED) {
                        statusHTML = (
                            <Td key={cellIndex}>Denied</Td>
                        );
                    } else {
                        statusHTML = (
                            <Td key={cellIndex}>
                                <button onClick={() => {onStatusUpdateHandler(task['id'], PTOConstants.APPROVED);}}>
                                    <i className="glyphicon glyphicon-ok"></i>
                                </button>
                                <button onClick={() => {onStatusUpdateHandler(task['id'], PTOConstants.DENIED);}}>
                                    <i className="glyphicon glyphicon-remove"></i>
                                </button>
                            </Td>
                        );
                    }
                    return statusHTML;
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
        <tbody className="pto-table__body">
            {bodyHtml}
        </tbody>
    );
};

class PTOTable extends Component {
    constructor(props) {
        super(props);
        this._onSortHandler = ::this._onSortHandler;
    }
    _onSortHandler(e) {
        const category = e.target.dataset.name;
        this.props.onSortHandler(category);
    }
    render() {
        return (
            <div className="pto-table">
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

PTOTable.propTypes = {
    data                 : PropTypes.array.isRequired,
    titleKeyMap          : PropTypes.array.isRequired,
    enableSort           : PropTypes.bool,
    sortBy               : PropTypes.object,
    onSortHandler        : PropTypes.func,
    onStatusUpdateHandler: PropTypes.func,
    onDeleteHandler      : PropTypes.func
};

PTOTable.defaultProps = {
    enableSort: false,
    sortBy: {
        category: '',
        status: 0
    },
    onSortHandler        : () => {},
    onStatusUpdateHandler: () => {},
    onDeleteHandler      : () => {}
};

export default PTOTable;
