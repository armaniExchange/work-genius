
import React, { Component, PropTypes } from 'react';

import Td from '../A10-UI/Table/Td';
import {Button} from 'react-bootstrap';
import Select from 'react-select';

class DeviceTableBody extends Component {

  static propTypes = {
    data             : PropTypes.array.isRequired,
    releases         : PropTypes.array.isRequired,
    builds           : PropTypes.array.isRequired,
    upgradeDevice    : PropTypes.func.isRequired
  }

  changeRelease(item, value) {
    if (!item._release) {
      item._release = item.release;
    }
    item.release = value;
  }

  changeBuild(item, value) {
    if (!item._build) {
      item._build = item.build;
    }
    item.build = value;
  }

  upgradeAxServer(item) {
    if ((item._release && item._release !== item.release)
        || (item._build && String(item.build) !== String(item._build))) {
      const {upgradeDevice} = this.props;
      upgradeDevice(item);
    }
  }

  render() {
    const { data, releases, builds } = this.props;
    const wellStyles = {margin: '5px auto', width: '100%'};
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
          <Td>
            <Select
              className="text-left"
              value={row.release}
              options={releases.map(release => {
                return {label: release, value: release};
              })}
              onChange={ ::this.changeRelease.bind(this, row) }/>
          </Td>
          <Td>
            <Select
              className="text-left"
              value={row.build}
              options={builds.map(build => {
                return {label: build, value: build};
              })}
              onChange={ ::this.changeBuild.bind(this, row) }/>
            <Button
              style={wellStyles}
              bsSize="xsmall"
              bsStyle="success"
              onClick={ ::this.upgradeAxServer.bind(this, row) }>
                Upgrade</Button>
          </Td>
          <Td>
            <Button bsSize="xsmall" bsStyle="primary">Edit</Button>&nbsp;
            <Button bsSize="xsmall" bsStyle="success">Lock</Button>
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