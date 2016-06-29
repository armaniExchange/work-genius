
import actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';

// ******** Fetch data to redux. ********
const fetchData = {
  release: (data) => {
    return {
      type: actionTypes.FETCH_RESOURCE_DEVICE_RELEASE,
      data
    };
  },
  lock: (data) => {
    return {
      type: actionTypes.FETCH_RESOURCE_DEVICE_LOCK,
      data
    };
  },
  info: (data) => {
    return {
      type: actionTypes.FETCH_RESOURCE_DEVICE_INFO,
      data
    };
  },
  user: (data) => {
    return {
      type: actionTypes.FETCH_RESOURCE_DEVICE_USER,
      data
    };
  }
};


// ******** Request / dispose data actions. ********
const deviceActions = {
  info: () => {
    return (dispatch) => {
      let config = {
        method: 'POST',
        body: `{
            allDevices{
                ip,
                address,
                apc{
                  id,
                  url,
                  username,
                  password
                },
                console,
                model,
                product_id_magic,
                vcs_configured,
                is_e2e_machine,
                can_send_traffic,
                release,
                build,
                with_fpga,
                locked_by,
                locked_date,
                user_name,
                password,
                upgrading
            }
        }`,
        headers: {
            'Content-Type': 'application/graphql',
            'x-access-token': localStorage.token
        }
      };
      return fetch(SERVER_API_URL, config)
          .then((res) => res.json())
          .then((body) => {
            const data = body.data.allDevices ? body.data.allDevices : [];
            dispatch(fetchData.info(data));
          })
          .catch((err) => {
              throw new Error(err);
          });
    };
  },

  update: (item) => {
    return (dispatch) => {
      let data = {
        ip: item.ip,
        vcs_configured: item.vcs_configured,
        is_e2e_machine: item.is_e2e_machine,
        can_send_traffic: item.can_send_traffic,
        locked_by: item.locked_by,
        locked_date: item.locked_date
      };
      let config = {
                method: 'POST',
                body: `mutation RootMutationType {
                    updateDevice(data:"${JSON.stringify(data).replace(/\\/gi, '\\\\').replace(/\"/gi, '\\"')}")
                }`,
                headers: {
                    'Content-Type': 'application/graphql',
                    'x-access-token': localStorage.token
                }
            };
      return fetch(SERVER_API_URL, config)
          .then((res) => res.json())
          .then((body) => {
            console.log(dispatch);
            console.log(body);
          })
          .catch((err) => {
              throw new Error(err);
          });
    };
  }
};

const releaseActions = {
  get: function () {
    return (dispatch) => {
      let config = {
          method: 'POST',
          body: `{
                  getAllRelease(name:""){
                      id,
                      tag_name,
                      type
                  }
          }`,
          headers: {
              'Content-Type': 'application/graphql',
              'x-access-token': localStorage.token
          }
      };
      return fetch(SERVER_API_URL, config)
          .then((res) => res.json())
          .then((body) => {
              let release = body.data.getAllRelease;
              dispatch(fetchData.release(release));
          })
          .catch((err) => {
              throw new Error(err);
          });
    };
  },
  add: function (tag) {
    return (dispatch) => {
      var data = {tag_name: tag};
      let config = {
          method: 'POST',
          body: `mutation RootMutationType {
              createRelease(data:"${JSON.stringify(data).replace(/\"/gi, '\\"')}")
          }`,
          headers: {
              'Content-Type': 'application/graphql',
              'x-access-token': localStorage.token
          }
      };

      return fetch(SERVER_API_URL, config)
          .then((res) => res.json())
          .then(() => {
              dispatch(fetchData.release(data));
          })
          .catch((err) => {
              throw new Error(err);
          });
    };
  }
};


// Get all device info.
export function queryDeviceInfo() {
  return (dispatch, getState) => {
    let currentUser = getState().app.toJS().currentUser;
    dispatch(fetchData.user(currentUser));
    dispatch(releaseActions.get());
    dispatch(deviceActions.info());
  };
}

export function updateDevice(item){
  console.log(item);
  return (dispatch) => {
    dispatch(deviceActions.update(item));
  };
}

export function upgradeDevice(item) {
  console.log(item);
}



