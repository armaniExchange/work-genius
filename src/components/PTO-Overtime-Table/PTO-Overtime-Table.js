// Styles
import './PTO-Overtime-Table.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
// Constants
import {
    PENDING,
    APPROVED,
    DENIED
} from '../../constants/pto-constants';
import Table from '../A10-UI/Table/Table';
import Th from '../A10-UI/Table/Th';
import Td from '../A10-UI/Table/Td';
import ApproveButton from '../A10-UI/Button/Approve-Button';
import DenyButton from '../A10-UI/Button/Deny-Button';

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
                className="overtime-table__header"
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

let TableBody = ({ data, titleKeyMap, onStatusUpdateHandler }) => {
    let bodyHtml = (
        <tr>
            <Td
                colSpan={titleKeyMap.length}
                className="overtime-table__body--empty">
                No Match Result!
            </Td>
        </tr>
    );

    if (data.length > 0) {
        bodyHtml = data.map((task, bodyIndex) => {
            const cellHtml = titleKeyMap.map((header, cellIndex) => {
                let actionsHTML;
                if (header['key'] === 'id') {
                    if (task.status === PENDING) {
                        actionsHTML = (
                            <Td key={cellIndex}>
                                <ApproveButton onClick={() => {onStatusUpdateHandler(task['id'], APPROVED, task['hours']);}} />
                                <DenyButton onClick={() => {onStatusUpdateHandler(task['id'], DENIED, task['hours']);}} />
                            </Td>
                        );
                    } else {
                        actionsHTML = (
                            <Td key={cellIndex}>
                                No actions!
                            </Td>
                        );
                    }
                    return actionsHTML;
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
        <tbody className="overtime-table__body">
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
            <div className="overtime-table">
                <Table className="overtime-table__table-content">
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
