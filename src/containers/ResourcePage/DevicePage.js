import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as appActions from '../../actions/app-actions';
import * as mainActions from '../../actions/main-actions';
import * as deviceActions from '../../actions/device-actions';

import Breadcrumb from '../../components/A10-UI/Breadcrumb';
import BREADCRUMB from '../../constants/breadcrumb';

import DeviceTable from '../../components/DeviceTable/DeviceTable';

class DevicePage extends Component{

  static propTypes = {
    name: PropTypes.string,
    cloumns: PropTypes.array,
    data: PropTypes.array,
    updateData: PropTypes.number,
    currentUser: PropTypes.object.isRequired,
    upgradeState: PropTypes.object,
    releases: PropTypes.object.isRequired,
    deviceActions: PropTypes.object.isRequired
  }

  componentWillMount() {
    const { queryDeviceInfo } = this.props.deviceActions;
    queryDeviceInfo();
  }

  render() {

    return (
      <section>
        <Breadcrumb data={BREADCRUMB.device} />
        <DeviceTable {...this.props} {...this.props.deviceActions}/>
      </section>);
  }
}

function mapStateToProps(state) {
    return Object.assign(
        {},
        state.device.toJS(),
        state.app.toJS()
    );
}

function mapDispatchToProps(dispatch) {
  return {
    deviceActions: bindActionCreators(deviceActions, dispatch),
    mainActions: bindActionCreators(mainActions, dispatch),
    appActions: bindActionCreators(appActions, dispatch)
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DevicePage);
