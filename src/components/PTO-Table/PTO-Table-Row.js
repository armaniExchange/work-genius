import React, { Component, PropTypes } from 'react';

class PTOTableRow extends Component {
    render() {

        let rowData = this.props.data;

        return (
            <tr>
                <td className="mdl-data-table__cell--non-numeric">{rowData.startDate}</td>
                <td className="mdl-data-table__cell--non-numeric">{rowData.toDate}</td>
                <td>{rowData.totalHours}</td>
                <td className="mdl-data-table__cell--non-numeric">{rowData.applyDate}</td>
                <td className="mdl-data-table__cell--non-numeric">{rowData.isApproved}</td>
                <td className="mdl-data-table__cell--non-numeric">{rowData.memory}</td>
                <td className="mdl-data-table__cell--non-numeric">
                    <a href="#">cancel</a>
                </td>
            </tr>
        );
    }
}

PTOTableRow.propTypes = {
    data: PropTypes.object.isRequired,
};

export default PTOTableRow;