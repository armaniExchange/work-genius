import React, { Component, PropTypes } from 'react';

import PTOTableRow from './PTO-Table-Row';

class PTOTable extends Component {

    render() {

        let ptoData = this.props.data;

        return (
            <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                <thead>
                    <tr>
                        <th className="mdl-data-table__cell--non-numeric">Start Date</th>
                        <th className="mdl-data-table__cell--non-numeric">To Date</th>
                        <th>Total Hours</th>
                        <th className="mdl-data-table__cell--non-numeric">Apply Date</th>
                        <th className="mdl-data-table__cell--non-numeric">Approved</th>
                        <th className="mdl-data-table__cell--non-numeric">Memory</th>
                        <th className="mdl-data-table__cell--non-numeric">Cancel</th>
                    </tr>
                </thead>
                <tbody>
                    {ptoData.map((pto, index) => 
                        <PTOTableRow key={index} data={pto}/>
                    )}
                </tbody>
            </table>
        );
    }
}

PTOTable.propTypes = {
    data: PropTypes.array,
};

PTOTable.defaultProps = {
    data: []
};

export default PTOTable;
