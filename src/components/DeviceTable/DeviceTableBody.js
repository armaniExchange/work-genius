
import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import Td from '../A10-UI/Table/Td';
import { Button, ButtonGroup } from 'react-bootstrap';
import Select from 'react-select';

class DeviceTableBody extends Component {

  static propTypes = {
    data             : PropTypes.array.isRequired,
    releases         : PropTypes.array.isRequired,
    builds           : PropTypes.array.isRequired,
    upgradeDevice    : PropTypes.func.isRequired,
    updateDevice     : PropTypes.func.isRequired,
    currentUser      : PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.state = {
      isEdit: {},
      data: []
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    this.setState( {data: data });
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

  changeInputConfig(row, field, event) {
    let value = event.target.value;
    row[field] = value;
  }

  toEditItem(item) {
    const isEdit = this.state.isEdit;
    isEdit[item.ip] = true;
    this.setState({isEdit: isEdit});
  }

  toApplyItem(item) {
    const isEdit = this.state.isEdit;
    isEdit[item.ip] = false;
    this.setState({isEdit: isEdit});
    console.log(item);

    const { updateDevice } = this.props;
    updateDevice(item);
  }

  toLock(item, lock) {
    const data = this.state.data;
    const itemIn = data.find((one) => {
      return one.ip === item.ip;
    });

    const { updateDevice, currentUser } = this.props;

    if (lock) {
      itemIn.locked_by = currentUser.nickname;
      itemIn.locked_date = moment().format('x');
    } else {
      itemIn.locked_by = '';
      itemIn.locked_date = '';
    }

    updateDevice(itemIn);

    this.setState({ data: data });

  }

  render() {
    const { releases, builds, currentUser } = this.props;
    const username = currentUser.nickname;
    const wellStyles = {margin: '5px auto', width: '100%'};
    console.log(this.state.data);
    const bodyHtml = this.state.data.map((row, index) => {
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
          <Td>{row.model}</Td>
          <Td>{row.product_id_magic}</Td>
          <Td>
            { !this.state.isEdit[row.ip]
              ? (<span>{row.vcs_configured}</span>)
              : (<input
                    className="form-control"
                    type="text"
                    defaultValue={row.vcs_configured}
                    onChange={ ::this.changeInputConfig.bind(this, row, 'vcs_configured') }
                    ref={row.ip + '-vcs'}/>) }
          </Td>
          <Td>
            { !this.state.isEdit[row.ip]
              ? (<span>{row.is_e2e_machine}</span>)
              : (<input
                    className="form-control"
                    type="text"
                    defaultValue={row.is_e2e_machine}
                    onChange={ ::this.changeInputConfig.bind(this, row, 'is_e2e_machine') }
                    ref={row.ip + '-vcs'}/>) }
          </Td>
          <Td>
            { !this.state.isEdit[row.ip]
              ? (<span>{row.can_send_traffic}</span>)
              : (<input
                    className="form-control"
                    type="text"
                    defaultValue={row.can_send_traffic}
                    onChange={ ::this.changeInputConfig.bind(this, row, 'can_send_traffic') }
                    ref={row.ip + '-vcs'}/>) }
          </Td>
          <Td>
            <Select
              className="text-left"
              value={row.release}
              options={releases.map(release => {
                return {label: release.tag_name, value: release.tag_name};
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
            <ButtonGroup>
              { !this.state.isEdit[row.ip]
                ? (<Button bsSize="xsmall" bsStyle="primary"
                    onClick={ ::this.toEditItem.bind(this, row) }>Edit</Button>)
                : (<Button bsSize="xsmall" bsStyle="primary"
                    onClick={ ::this.toApplyItem.bind(this, row) }>Apply</Button>) }
              { (!!row.locked_by && row.locked_by !== '' && row.locked_by !== 'N/A' )
                ? (username === row.locked_by
                  ?(<Button bsSize="xsmall" bsStyle="danger"
                      onClick={ ::this.toLock.bind(this, row, false)}>Unlock</Button>)
                  :(<Button bsSize="xsmall" bsStyle="warning">{row.locked_by}</Button>))
                : (<Button bsSize="xsmall" bsStyle="success"
                    onClick={ ::this.toLock.bind(this, row, true)}>Lock</Button>)}
            </ButtonGroup>
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