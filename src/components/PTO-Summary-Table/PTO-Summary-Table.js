// Styles
import './PTO-Summary-Table.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import Table from '../A10-UI/Table/Table';
import Th from '../A10-UI/Table/Th';
import Td from '../A10-UI/Table/Td';

let TableHeaders = ({ titleKeyMap, onSortHandler }) => {
    let headerHtml = titleKeyMap.map((headerObj, index) => {
        let header = headerObj.title;
        return (
            <Th
                key={index}
                className="pto-summary-table__header"
                data-name={header}
                onClick={onSortHandler}>
                <span data-name={header}>{header}</span>
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

let TableBody = ({ data, titleKeyMap, highlightName }) => {
    let bodyHtml = (
        <tr>
            <Td
                colSpan={titleKeyMap.length}
                className="pto-summary-table__body--empty">
                No Match Result!
            </Td>
        </tr>
    );

    if (data.length > 0) {
        bodyHtml = data.map((user, bodyIndex) => {
            const cellHtml = titleKeyMap.map((header, cellIndex) => {
                return (
                    <Td key={cellIndex} className="pto-summary-table__body">{user[header['key']]}</Td>
                );
            });
            const rowClassNames = highlightName === user.name ? 'pto-summary-table--highlight': '';
            return (
                <tr key={bodyIndex} className={rowClassNames}>
                    {cellHtml}
                </tr>
            );
        });
    }

    return (
        <tbody>
            {bodyHtml}
        </tbody>
    );
};

class PTOTable extends Component {
    render() {
        return (
            <div className="pto-summary-table">
                <Table className="pto-summary-table__table-content">
                    <TableHeaders
                        {...this.props} />
                    <TableBody {...this.props} />
                </Table>
            </div>
        );
    }
}

PTOTable.propTypes = {
    data         : PropTypes.array.isRequired,
    titleKeyMap  : PropTypes.array.isRequired,
    highlightName: PropTypes.string
};

PTOTable.defaultProps = {
    highlightName: ''
};

export default PTOTable;
