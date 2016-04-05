// Libraries
import React, { Component, PropTypes } from 'react';
// Components
import Table from '../../components/A10-UI/Table/Table';
import Th from '../../components/A10-UI/Table/Th';
import Td from '../../components/A10-UI/Table/Td';
// Styles
import './_AssignmentReportTable.css';

const DIFFICULTY_MAP = {
    'Very Hard': 0,
    'Hard': 1,
    'Medium': 2,
    'Easy': 3,
    'Nothing': 4
};

class AssignmentReportTable extends Component {
    _constructTableData() {
        const { data, userData } = this.props;
        let result = {};

        if (data.length && userData.length) {
            userData.forEach((user) => {
                let diffArr = new Array(5).fill(0);
                data.forEach((category) => {
                    if (category.difficulty && (+category.primary_owner === +user.id || +category.primary_owner === +user.id)) {
                        let value = diffArr[DIFFICULTY_MAP[category.difficulty.title]];
                        diffArr[DIFFICULTY_MAP[category.difficulty.title]] = value ? value + 1 : 1;
                    }
                });
                result[user.name] = diffArr;
            });
        }

        return result;
    }
    _renderHeader() {
        let result = [(<Th key={'initial'}>Name</Th>)]
            .concat(Object.keys(DIFFICULTY_MAP).map((diff, index) => {
                return (
                    <Th key={index}>{diff}</Th>
                );
            }))
            .concat([(<Th key={'tail'}>Total</Th>)]);
        return result;
    }
    _renderBody(tableData) {
        return Object.keys(tableData).sort().map((user, index) => {
            let diffCount = tableData[user],
                total = 0;
            let countHtml = [(<Td key={'initial'}>{user}</Td>)]
                .concat(diffCount.map((count, countIndex) => {
                    total += count;
                    return (
                        <Td key={countIndex}>{count}</Td>
                    );
                }))
                .concat([(<Td key={'tail'}>{total}</Td>)]);
            return (
                <tr key={index}>{countHtml}</tr>
            );
        });
    }
    render() {
        let tableData = ::this._constructTableData(),
            tableHeaderHtml = ::this._renderHeader(),
            tableBodyHtml = ::this._renderBody(tableData);

        return (
          <div className="assignment-category-tree">
              <h5 style={{color:'#9cf'}}>Reporting</h5>
              <Table>
                  <thead>
                      <tr>{tableHeaderHtml}</tr>
                  </thead>
                  <tbody>
                      {tableBodyHtml}
                  </tbody>
              </Table>
          </div>
        );
    }
}

AssignmentReportTable.propTypes = {
    data: PropTypes.array.isRequired,
    userData: PropTypes.array.isRequired
};

export default AssignmentReportTable;
