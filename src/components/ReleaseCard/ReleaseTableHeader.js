import React, { Component } from 'react';
import Th from '../A10-UI/Table/Th';

class ReleaseTableHeader extends Component {

  render() {
    return (
      <thead>
        <tr>
          <Th className="table_header_style">Release</Th>
          <Th className="table_header_style">Release Date</Th>
          <Th className="table_header_style">GUI Priority</Th>
          <Th className="table_header_style">Action</Th>
        </tr>
      </thead>
    );
  }
}

export default ReleaseTableHeader;
