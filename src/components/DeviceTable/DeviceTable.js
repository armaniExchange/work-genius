
import React, { Component, PropTypes } from 'react';

// Constants
import Table from '../A10-UI/Table/Table';

import DeviceTableHeader from './DeviceTableHeader.js';
import DeviceTableBody from './DeviceTableBody.js';


class DeviceTable extends Component {

  render() {

    const { cloumns } = this.props;
    return (
      <div>
        <Table className="bug-report-table">
          <DeviceTableHeader cloumns={ cloumns }/>
          <DeviceTableBody {...this.props} />
        </Table>
      </div>
    );
  };
}

DeviceTable.propTypes = {
    cloumns          : PropTypes.array
};

DeviceTable.defaultProps = {
};

export default DeviceTable;
