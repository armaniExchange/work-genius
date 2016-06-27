import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as appActions from '../../actions/app-actions';
import * as mainActions from '../../actions/main-actions';

import Breadcrumb from '../../components/A10-UI/Breadcrumb';
import BREADCRUMB from '../../constants/breadcrumb';

import DeviceTable from '../../components/DeviceTable/DeviceTable';

class DevicePage extends Component{

  static propTypes = {
    name: PropTypes.string,
    cloumns: PropTypes.array,
    data: PropTypes.array
  }

  render() {

    return (
      <section>
        <Breadcrumb data={BREADCRUMB.device} />
        <DeviceTable {...this.props}/>
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
    return Object.assign(
        {},
        // bindActionCreators(ResourceMapActions, dispatch),
        bindActionCreators(mainActions, dispatch),
        bindActionCreators(appActions, dispatch)
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DevicePage);
