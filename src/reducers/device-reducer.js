import actionTypes from '../constants/action-types';
import Immutable, { Map, List } from 'immutable';

const initialState = Map({
  cloumns: List.of(
      Map({ title: 'IP', key: 'ip', colspan: 1}),
      Map({ title: 'Address', key: 'address', colspan: 1}),
      Map({ title: 'APC', key: 'apc', colspan: 1}),
      Map({ title: 'Console', key: 'console', colspan: 1}),
      Map({ title: 'Ax Model', key: 'ax-model', colspan: 1}),
      Map({ title: 'Product ID Magic', key: 'product-id-magic', colspan: 1}),
      Map({ title: 'VCS', key: 'vcs', colspan: 1}),
      Map({ title: 'E2E Test Machine', key: 'e2e-test-machine', colspan: 1}),
      Map({ title: 'Traffic Mahcine', key: 'traffic-mahcine', colspan: 1}),
      Map({ title: 'Release', key: 'release', colspan: 1}),
      Map({ title: 'Build', key: 'build', colspan: 1}),
      Map({ title: 'Operation', key: 'operation', colspan: 1})
  ),
  // data: List.of(
  //     Map({ip: '192.168.99.54', apc: {id : 'N/A', url: 'http://192.168.99.56/', username: 'stsai', password: 'a10@stsaiA!)'}, address: 'TP', console: 'ssh 192.168.99.29:7026', 'ax-model': 'TH2600', 'product-id-magic': 'Yes', 'vcs': 'No', 'e2e-test-machine': 'Yes', 'traffic-mahcine': 'No', release: '4.1.1', build: '99'}),
  //     Map({ip: '192.168.105.82', apc: {id : '??', url: 'http://192.168.6.118/NMC/itt+FtpX0p800clEEEtQWw/outlctrl.htm', username: 'apc', password: 'apc'}, address: 'BJ', console: '', 'ax-model': 'TH2500', 'product-id-magic': 'No', 'vcs': 'No', 'e2e-test-machine': 'Yes', 'traffic-mahcine': 'No', release: '4.1.1', build: '99'}),
  //     Map({ip: '192.168.105.99', apc: {id : '12', url: 'http://192.168.6.118/NMC/itt+FtpX0p800clEEEtQWw/outlctrl.htm', username: 'apc', password: 'apc'}, address: 'BJ', console: 'telnet 192.168.105.11:2001', 'ax-model': 'TH3000', 'product-id-magic': 'No', 'vcs': 'No', 'e2e-test-machine': 'Yes', 'traffic-mahcine': 'No', release: '4.1.1', build: '99'}),
  //     Map({ip: '192.168.99.58', apc: {id : 'N/A', url: 'http://192.168.99.56/', username: 'stsai', password: 'a10@stsaiA!)'}, address: 'TP', console: 'ssh 192.168.99.29:7028', 'ax-model': 'TH3030S', 'product-id-magic': 'No', 'vcs': 'No', 'e2e-test-machine': 'Yes(If necessary)', 'traffic-mahcine': 'No', release: '4.1.1', build: '99'}),
  //     Map({ip: '192.168.105.72', apc: {id : '10', url: 'http://192.168.6.118/NMC/itt+FtpX0p800clEEEtQWw/outlctrl.htm', username: 'apc', password: 'apc'}, address: 'BJ', console: 'telnet 192.168.105.11:2003', 'ax-model': 'TH3030S', 'product-id-magic': 'No', 'vcs': 'No', 'e2e-test-machine': 'Yes(If necessary)', 'traffic-mahcine': 'No', release: '4.1.1', build: '99'}),
  //     Map({ip: '192.168.99.51', apc: {id : 'N/A', url: 'http://192.168.99.70/', username: 'ahuang', password: 'al_is_genius'}, address: 'TP', console: 'ssh 192.168.99.29:7023', 'ax-model': 'TH2500', 'product-id-magic': 'No', 'vcs': 'Master', 'e2e-test-machine': 'Yes', 'traffic-mahcine': 'Yes', release: '4.1.1', build: '99'}),
  //     Map({ip: '192.168.99.231', apc: {id : 'N/A', url: 'http://192.168.99.30/', username: 'stsai', password: 'a10@stsaiA!)'}, address: 'TP', console: 'ssh 192.168.99.29:7013', 'ax-model': 'TH2500', 'product-id-magic': 'No', 'vcs': 'Blade', 'e2e-test-machine': 'Yes', 'traffic-mahcine': 'Yes', release: '4.1.1', build: '99'}),
  //     Map({ip: '192.168.105.196', apc: {id : '11', url: 'http://192.168.6.118/NMC/itt+FtpX0p800clEEEtQWw/outlctrl.htm', username: 'apc', password: 'apc'}, address: 'BJ', console: 'telnet 192.168.105.11:2002', 'ax-model': 'TH2600', 'product-id-magic': 'No', 'vcs': 'Master', 'e2e-test-machine': 'Yes', 'traffic-mahcine': 'Yes', release: '4.1.1', build: '99'}),
  //     Map({ip: '192.168.105.197', apc: {id : '3', url: 'http://192.168.6.118/NMC/itt+FtpX0p800clEEEtQWw/outlctrl.htm', username: 'apc', password: 'apc'}, address: 'BJ', console: 'telnet 192.168.105.2:2008', 'ax-model': 'TH2600', 'product-id-magic': 'No', 'vcs': 'Blade', 'e2e-test-machine': 'Yes', 'traffic-mahcine': 'Yes', release: '4.1.1', build: '99'}),
  //     Map({ip: '192.168.99.59', apc: {id : 'N/A', url: 'http://192.168.99.56/', username: 'stsai', password: 'a10@stsaiA!)'}, address: 'TP', console: 'ssh 192.168.99.29:7027', 'ax-model': 'TH3030s', 'product-id-magic': 'Yes', 'vcs': 'No', 'e2e-test-machine': 'Yes', 'traffic-mahcine': 'No', release: '4.1.1', build: '99'}),
  //     Map({ip: '192.168.105.86', apc: {id : '9', url: 'http://192.168.6.118/NMC/itt+FtpX0p800clEEEtQWw/outlctrl.htm', username: 'apc', password: 'apc'}, address: 'BJ', console: 'telnet 192.168.105.11:2004', 'ax-model': 'TH3030s', 'product-id-magic': 'Yes', 'vcs': 'No', 'e2e-test-machine': 'Yes', 'traffic-mahcine': 'No', release: '4.1.1', build: '99'}),
  // ),
  data: List.of(),
  releases: Map({}),
  builds: List.of(),
  currentUser: Map({})
});

function fetchVersionToState(state, ip, data) {
  if (data.version && data.version.oper) {
    let version = data.version.oper;
    let devices = state.get('data').toJS();
    let device = devices.find((dev) => {
      return dev.ip === ip;
    });
    if (device) {
      device.boot_from = version['boot-from'];
      device.hd_pri = version['hd-pri'];
      device.hd_sec = version['hd-sec'];
      device.serial_number = version['serial-number'];

      let currentRelease = device.boot_from === 'HD_PRIMARY' ? device.hd_pri : device.hd_sec;
      let currentReleaseSplit = currentRelease.split('.');
      let build = currentReleaseSplit[currentReleaseSplit.length -1];
      currentReleaseSplit.length = currentReleaseSplit.length - 1;
      let release = currentReleaseSplit.join('_');
      device.release = release;
      device.build = build;
      state = state.set('data', Immutable.fromJS(devices));
    }
  }

  return state;
}

export default function demoReducer(state = initialState, action) {
  let nextState = state;
  switch (action.type) {
    case actionTypes.FETCH_RESOURCE_DEVICE_INFO:
      nextState = nextState.set('data', Immutable.fromJS(action.data));
      return nextState;
    case actionTypes.FETCH_RESOURCE_DEVICE_RELEASE:
      nextState = nextState.set('releases', action.data);
      return nextState;
    case actionTypes.FETCH_RESOURCE_DEVICE_LOCK:
      return nextState;
    case actionTypes.FETCH_RESOURCE_DEVICE_USER:
      nextState = nextState.set('currentUser', action.data);
      return nextState;
    case actionTypes.FETCH_RESOURCE_DEVICE_VERSION:
      nextState = fetchVersionToState(nextState, action.ip, action.data);
      console.log(nextState.get('data'));
      return nextState;
    default:
      return nextState;
  }
};
