// Style
import './_PTOPage';

// React & Redux
import React, { Component } from 'react';
import ReactBsTable from 'react-bootstrap-table';

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

class PTOPage extends Component {


	render () {
    return (
      <BootstrapTable data={products} striped={true} hover={true} >
        <TableHeaderColumn isKey={true} dataField="id" dataSort={true}>Product ID</TableHeaderColumn>
        <TableHeaderColumn dataField="name" dataSort={true} >Product Name</TableHeaderColumn>
        <TableHeaderColumn dataField="price" dataSort={true}>Product Price</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default PTOPage;
