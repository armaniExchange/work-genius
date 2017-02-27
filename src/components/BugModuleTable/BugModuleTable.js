// Styles
import 'react-select/dist/react-select.css';
// Libraries
import React, { Component, PropTypes } from 'react';

import Table from '../A10-UI/Table/Table';
import Th from '../A10-UI/Table/Th';
import BugModuleBody from './BugModuleBody';

let TableHeaders = ({ titleKeyMap}) => {
    let headerHtml = titleKeyMap.map((headerObj, index) => {
        let header = headerObj.title;
        let colSpan = headerObj.colspan;

        let filterIconHtml = (<span></span>);

        return (
            <Th
                key={index}
                className="bug-report-table__header"
                data-name={header}
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

class BugModuleTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="bug-report-table">
                <Table className="bug-report-table">
                    <TableHeaders {...this.props} />
                    <BugModuleBody {...this.props} />
                </Table>
            </div>
        );
    }
}

BugModuleTable.propTypes = {
    data                 : PropTypes.array.isRequired,
    titleKeyMap          : PropTypes.array.isRequired
};

export default BugModuleTable;
