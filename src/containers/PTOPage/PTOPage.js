// Style
import './_PTOPage';

// React & Redux
import React, { Component } from 'react';
import ReactBsTable from 'react-bootstrap-table';

// Components
import PTOForm from '../../components/PTO-Form/PTO-Form';
import PTOTable from '../../components/PTO-Table/PTO-Table';

var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;

var products = [
  {
      id: 1,
      name: 'Product1',
      price: 120
  },{
      id: 2,
      name: 'Product2',
      price: 80
  }];

let ptoData = [{
    startDate: '2015-08-17',
    toDate: '2015-08-18',
    totalHours: 16,
    applyDate: '2015-08-10',
    isApproved: 'Approved',
    memory: 'go home'
},
{
    startDate: '2015-09-11',
    toDate: '2015-09-13',
    totalHours: 24,
    applyDate: '2015-09-10',
    isApproved: 'Not Approved',
    memory: 'go home'
}];

class PTOPage extends Component {
    render() {
        return (
            <div>
                <section>PTO Page</section>
                <div className="mdl-grid">
                    <PTOForm />
                    <PTOTable data={ptoData} />
                </div>
                <BootstrapTable data={products} striped={true} hover={true} >
                    <TableHeaderColumn isKey={true} dataField="id" dataSort={true}>Product ID</TableHeaderColumn>
                    <TableHeaderColumn dataField="name" dataSort={true} >Product Name</TableHeaderColumn>
                    <TableHeaderColumn dataField="price" dataSort={true}>Product Price</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}

export default PTOPage;
