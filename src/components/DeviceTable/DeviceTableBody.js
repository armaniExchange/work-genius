
import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import Td from '../A10-UI/Table/Td';
import { Button, ButtonGroup } from 'react-bootstrap';
import Select from 'react-select';

import './Device.css';

class DeviceTableBody extends Component {

  static propTypes = {
    data             : PropTypes.array.isRequired,
    updateData       : PropTypes.number,
    releases         : PropTypes.object.isRequired,
    builds           : PropTypes.array.isRequired,
    upgradeDevice    : PropTypes.func.isRequired,
    updateDevice     : PropTypes.func.isRequired,
    currentUser      : PropTypes.object.isRequired,
    upgradeState     : PropTypes.object
  }

  constructor() {
    super();
    this.state = {
      updateData: 0,
      isEdit: {},
      data: [],
      releaseOptions: [],
      buildOptions: {},
      vcsLabel: [
        {label: 'Master', value: 'Master'},
        {label: 'Blade', value: 'Blade'},
        {label: 'No', value: 'No'}
      ],
      yesOrNo: [
        {label: 'Yes', value: 'Yes'},
        {label: 'No', value: 'No'},
        {label: 'Yes(If necessary)', value: 'Yes(If necessary)'}
      ]
    };
  }

  componentWillReceiveProps(nextProps) {
    const { updateData, data, releases, upgradeState } = nextProps;
    const updateData2 = this.state.updateData;

    if (updateData2 === 0 || updateData2 !== updateData) {
      this.setState( {data: data, updateData: updateData});
      const releaseOptions = [];
      const buildOptions = {};
      for (let release in releases) {
        if (releases.hasOwnProperty(release)) {
          releaseOptions.push({label: release, value: release});
          const builds = releases[release];
          const options = [];
          for (let build in builds) {
            if (builds.hasOwnProperty(build)) {
              options.push({label: build, value: build});
            }
          }
          buildOptions[release] = options;
        }
      }
      this.setState({
        releaseOptions: releaseOptions,
        buildOptions: buildOptions
      });
    }

    if (upgradeState.success && upgradeState.item) {
      const item = upgradeState.item;
      const dataIn = this.state.data;
      const itemIn = dataIn.find( o => {
        return o.ip === item.ip;
      });
      if (itemIn) {
        itemIn.upgrading = false;
        itemIn['hd_' + item.image] = item.release.replace(/_/g, '.') + '.' + item.build;
        this.setState({data: dataIn});
      }
    }

  }

  changeRelease(item, value) {
    const data = this.state.data;
    const itemIn = data.find((one) => {
      return one.ip === item.ip;
    });
    if (!itemIn._release) {
      itemIn._release = itemIn.release;
    }
    if (!itemIn._build) {
      itemIn._build = itemIn.build;
    }
    if (itemIn._release !== value) {
      itemIn.build = '';
    }
    itemIn.release = value;
    this.setState({data: data});
  }

  changeBuild(item, value) {
    const data = this.state.data;
    const itemIn = data.find((one) => {
      return one.ip === item.ip;
    });
    if (!itemIn._build) {
      itemIn._build = itemIn.build;
    }
    itemIn.build = value;
    this.setState({data: data});
  }

  upgradeAxServer(item) {
    const {upgradeDevice, data} = this.props;
    if ( !item.image ) {
      item.image = item.boot_from === 'HD_PRIMARY' ? 'pri' : 'sec';
    }

    const currentImage = item.boot_from === 'HD_PRIMARY' ? 'pri' : 'sec';

    if ( item.image !== currentImage
        || (item._release && item._release !== item.release)
        || (item._build && String(item.build) !== String(item._build))) {

      // const {upgradeDevice} = this.props;
      upgradeDevice(item);

      const itemIn = data.find((one) => {
        return one.ip === item.ip;
      });
      if (itemIn) {
        itemIn.upgrading = true;
        this.setState({data: data});
      }
    }
  }

  changeSelectConfig(row, field, value) {
    // let value = event.target.value;
    row[field] = value;
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

  choiceImage(item, image) {
    const {data} = this.props;
    const itemIn = data.find((one) => {
      return one.ip === item.ip;
    });
    itemIn['image'] = image;
    this.setState({data: data});
  }

  toApplyItem(item) {
    const isEdit = this.state.isEdit;
    isEdit[item.ip] = false;
    this.setState({isEdit: isEdit});

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
    const { currentUser, upgradeState } = this.props;
    const username = currentUser.nickname;
    const wellStyles = {margin: '5px auto', width: '100%'};
    console.log('000000000000000000000000000000000');
    console.log(upgradeState);
    const bodyHtml = this.state.data.map((row, index) => {
      return (
        <tr key={index} >
          <Td className="td-default">
            <a className="btn-link" href={'http://' + row.ip} target="_black">{row.ip}</a>
            <span
                className={ 'btn-xs btn-success span-default '
                    + (row.boot_from === 'HD_PRIMARY' ? '' : 'backgroup-gray ')
                    + (row.image === 'pri' ? 'choice-image ' : '')}
                onClick={ ::this.choiceImage.bind(this, row, 'pri') }
                title={'Pri: ' + (row.hd_pri ? row.hd_pri : '')}>
              Pri: {row.hd_pri}</span>
              <checkbox />
            <span
                className={ 'btn-xs btn-success span-default '
                    + (row.boot_from === 'HD_SECONDARY' ? '' : 'backgroup-gray ')
                    + (row.image === 'sec' ? 'choice-image ' : '') }
                onClick={ ::this.choiceImage.bind(this, row, 'sec') }
                title={'Sec: ' + (row.hd_sec ? row.hd_sec : '')}>
              Sec: {row.hd_sec}</span>
              <checkbox />
          </Td>
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
          <Td>
            { !this.state.isEdit[row.ip]
              ? (<span>{row.console}</span>)
              : (<input
                    className="form-control"
                    type="text"
                    defaultValue={row.console}
                    onChange={ ::this.changeInputConfig.bind(this, row, 'console') }
                    ref={row.ip + '-vcs'}/>)}
          </Td>
          <Td>
            { !this.state.isEdit[row.ip]
              ? (<span>{row.model}<br />{row.serial_number}</span>)
              : (<input
                    className="form-control"
                    type="text"
                    defaultValue={row.model}
                    onChange={ ::this.changeInputConfig.bind(this, row, 'model') }
                    ref={row.ip + '-vcs'}/>)}
          </Td>
          <Td>
            { !this.state.isEdit[row.ip]
              ? (<span>{row.product_id_magic}</span>)
              : (<Select
                  className="text-left"
                  value={ row.product_id_magic }
                  options={ this.state.yesOrNo }
                  onChange={ ::this.changeSelectConfig.bind(this, row, 'product_id_magic') }/>) }
          </Td>
          <Td>
            { !this.state.isEdit[row.ip]
              ? (<span>{row.vcs_configured}</span>)
              : (<Select
                  className="text-left"
                  value={ row.vcs_configured }
                  options={ this.state.vcsLabel }
                  onChange={ ::this.changeSelectConfig.bind(this, row, 'vcs_configured') }/>) }
          </Td>
          <Td>
            { !this.state.isEdit[row.ip]
              ? (<span>{row.is_e2e_machine}</span>)
              : (<Select
                  className="text-left"
                  value={ row.is_e2e_machine }
                  options={ this.state.yesOrNo }
                  onChange={ ::this.changeSelectConfig.bind(this, row, 'is_e2e_machine') }/>) }
          </Td>
          <Td>
            { !this.state.isEdit[row.ip]
              ? (<span>{row.can_send_traffic}</span>)
              : (<Select
                  className="text-left"
                  value={ row.can_send_traffic }
                  options={ this.state.yesOrNo }
                  onChange={ ::this.changeSelectConfig.bind(this, row, 'can_send_traffic') }/>) }
          </Td>
          <Td>
            { !this.state.isEdit[row.ip]
              ? (<span>{row.release}</span>)
              : (<Select
                    className="text-left"
                    value={ row.release }
                    options={ this.state.releaseOptions }
                    onChange={ ::this.changeRelease.bind(this, row) }/>) }
          </Td>
          <Td>
            { !this.state.isEdit[row.ip]
              ? (<span>{row.build}</span>)
              : (<Select
                    className="text-left"
                    value={row.build}
                    options={ this.state.buildOptions[row.release] }
                    onChange={ ::this.changeBuild.bind(this, row) }/>) }
            { row.upgrading
              ? (<Button
                  className={!this.state.isEdit[row.ip] ? 'hidden' : ''}
                  style={wellStyles}
                  bsSize="xsmall"
                  bsStyle="warning">
                    Upgrading ...</Button>)
              : (<Button
                  className={!this.state.isEdit[row.ip] ? 'hidden' : ''}
                  style={wellStyles}
                  bsSize="xsmall"
                  disabled={username !== row.locked_by}
                  bsStyle="success"
                  onClick={ ::this.upgradeAxServer.bind(this, row) }>
                    Upgrade</Button>) }
          </Td>
          <Td>
            <ButtonGroup style={{ minWidth: '150px' }}>
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