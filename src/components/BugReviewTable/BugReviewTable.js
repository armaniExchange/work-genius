// Styles
import './BugReviewTable.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
// Constants
import Table from '../A10-UI/Table/Table';
import Th from '../A10-UI/Table/Th';
import Td from '../A10-UI/Table/Td';
import RadioGroup from '../A10-UI/Input/Radio-Group';

let TableHeaders = ({ titleKeyMap, onSortHandler, sortBy, enableSort}) => {
    let headerHtml = titleKeyMap.map((headerObj, index) => {
        let header = headerObj.title;
        let colSpan = headerObj.colspan;
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
                colSpan={colSpan}
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


// var resolvedReasonTypeChange = function (data, e){
//     console.log(data);
//     console.log(e);
// };

let TableBody = ({ data, titleKeyMap, resolvedReasonTypes, resolvedReasonTypeChange}) => {
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
                let isAlignLeft = header['key'] === 'title';
                let className = isAlignLeft ? '' : 'bug-review-table__body--center';

                var resolvedReasonChange = function (type) {
                    resolvedReasonTypeChange(review, type);
                };

                if ( header['key'] === 'resolved_type' ){
                    return (
                        <Td isAlignLeft="true" key={cellIndex}
                            className="bug-review-table__body--front"
                            colSpan={header['colspan']}>
                            <RadioGroup aryRadioConfig={resolvedReasonTypes} checkRadio="axapi" onRadioChange={resolvedReasonChange}/>
                        </Td>
                    );
                }

                return (
                    <Td key={cellIndex}
                    className={className}
                    colSpan={header['colspan']}>{review[header['key']]}</Td>
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
                <Table className="bug-review-table">
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
    resolvedReasonTypes  : PropTypes.array.isRequired,
    enableSort           : PropTypes.bool,
    sortBy               : PropTypes.object,
    onSortHandler        : PropTypes.func,
    onStatusUpdateHandler: PropTypes.func,
    onDeleteHandler      : PropTypes.func,
    resolvedReasonTypeChange: PropTypes.func
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
