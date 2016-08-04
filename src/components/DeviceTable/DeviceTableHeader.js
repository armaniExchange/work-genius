
import React, { Component, PropTypes } from 'react';

import Th from '../A10-UI/Table/Th';

class DeviceTableHeader extends Component {

  static propTypes = {
    cloumns: PropTypes.array.isRequired
  }

  render() {
    const { cloumns } = this.props;
    const headerHtml = cloumns.map((cloumn, index) => {
      return (
        <Th
          key={index}
          colSpan={cloumn.colspan}
          className="bug-report-table__header"
        >
          {cloumn.title}
        </Th>
      );
    });
    return (
      <thead>
        <tr>{headerHtml}</tr>
      </thead>
    );
  };
}


DeviceTableHeader.defaultProps = {
  cloumns: []
};

export default DeviceTableHeader;