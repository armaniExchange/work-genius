
import actionTypes from '../constants/action-types';

// ******** Fetch data to redux. ********
const fetchData = {
  info: (data) => {
    return {
      type: actionTypes.FETCH_RESOURCE_DEVIE_INFO,
      data
    };
  }
};


// ******** Request / dispose data actions. ********
const deviceActions = {
  info: () => {
    return (dispatch) => {
      let releases = ['3.2.0', '3.2.1', '3.2.2', '4.1.0', '4.1.1'];
      let builds = [97, 98, 99, 100, 101, 102];
      const data = {
        releases : releases,
        builds: builds
      };
      dispatch(fetchData.info(data));
    };
  }
};


// Get all device info.
export function queryDeviceInfo() {
  return (dispatch) => {
    dispatch(deviceActions.info());
  };
}

export function upgradeDevice(item) {
  console.log(item);
}



