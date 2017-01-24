// Styles
import './BugReviewTable.css';
import 'react-select/dist/react-select.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
// Constants
import Table from '../A10-UI/Table/Table';
import Th from '../A10-UI/Table/Th';
// import Td from '../A10-UI/Table/Td';
// import Select from 'react-select';
import BugReviewTableBody from './BugReviewTableBody';

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
                    <BugReviewTableBody    {...this.props} />
                </Table>
            </div>
        );
    }
}

BugReviewTable.propTypes = {
    data                 : PropTypes.array.isRequired,
    titleKeyMap          : PropTypes.array.isRequired,
    resolvedReasonTypes  : PropTypes.array.isRequired,
    optionsReviewTags    : PropTypes.array.isRequired,
    optionsIntroduced    : PropTypes.array.isRequired,
    optionsMenus         : PropTypes.array.isRequired,
    enableSort           : PropTypes.bool,
    sortBy               : PropTypes.object,
    allUsers             : PropTypes.array,
    onSortHandler        : PropTypes.func,
    onStatusUpdateHandler: PropTypes.func,
    onDeleteHandler      : PropTypes.func,
    resolvedReasonTypeChange: PropTypes.func,
    changeReviewTagOptions: PropTypes.func,
    changeMenuTagOptions: PropTypes.func,
    changeReviewText:   PropTypes.func,
    changeIntroducedTagOptions: PropTypes.func,
    changeOwnerUserOptions: PropTypes.func
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
