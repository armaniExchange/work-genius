
import React, { Component, PropTypes } from 'react';

import Td from '../A10-UI/Table/Td';
import {Button} from 'react-bootstrap';

class DeviceTableBody extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired
  }

  render() {
    const { data } = this.props;
    const bodyHtml = data.map((row, index) => {
      return (
        <tr key={index}>
          <Td>{row.ip}</Td>
          <Td>{row.address}</Td>
          <Td>{row.apc && (
            <div>
              ID:&nbsp;{row.apc.id}&nbsp;&nbsp;
              <a href={row.apc.url} target="_black">APC</a>
              <br />
              {row.apc.username}
              <br />
              {row.apc.password}
            </div>)}</Td>
          <Td>{row.console}</Td>
          <Td>{row['ax-model']}</Td>
          <Td>{row['product-id-magic']}</Td>
          <Td>{row['vcs']}</Td>
          <Td>{row['e2e-test-machine']}</Td>
          <Td>{row['traffic-mahcine']}</Td>
          <Td>{row.release}</Td>
          <Td>{row.build}</Td>
          <Td>
            <Button bsSize="small" bsStyle="primary">Edit</Button>&nbsp;
            <Button bsSize="small" bsStyle="success">Lock</Button>
          </Td>
        </tr>
      );
    });
    return (
      <tbody>
        {bodyHtml}
      </tbody>
    );
  };
}


DeviceTableBody.defaultProps = {
  data: []
};

export default DeviceTableBody;