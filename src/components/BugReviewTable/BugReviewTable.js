// Styles
import './BugReviewTable.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
// Constants
import Table from '../A10-UI/Table/Table';
import Th from '../A10-UI/Table/Th';
import Td from '../A10-UI/Table/Td';

let TableHeaders = ({ titleKeyMap, onSortHandler, sortBy, enableSort}) => {
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
                onClick={onSortHandler}
                >
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

let TableBody = ({ data, titleKeyMap }) => {
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
        bodyHtml = data.map((review, bodyIndex) => {
            const cellHtml = titleKeyMap.map((header, cellIndex) => {
                return (
                    <Td key={cellIndex}>{review[header['key']]}</Td>
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

class BugReviewTable extends Component {
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
                    <TableHeaders {...this.props} />
                    <TableBody    {...this.props} />
                </Table>
            </div>
        );
    }
}

BugReviewTable.propTypes = {
    data                 : PropTypes.array.isRequired,
    titleKeyMap          : PropTypes.array.isRequired,
    enableSort           : PropTypes.bool,
    sortBy               : PropTypes.object,
    onSortHandler        : PropTypes.func,
    onStatusUpdateHandler: PropTypes.func,
    onDeleteHandler      : PropTypes.func
};

BugReviewTable.defaultProps = {
    enableSort: false,
    sortBy: {
        category: '',
        status: 0
    },
    onSortHandler        : () => {},
    onStatusUpdateHandler: () => {},
    onDeleteHandler      : () => {}
};

export default BugReviewTable;
