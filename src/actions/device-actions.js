
import actionTypes from '../constants/action-types';
import { SERVER_API_URL, SERVER_BASIC_URL } from '../constants/config';
import {notify} from '../libraries/notification';

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
  },
  version: (ip, data) => {
    return {
      type: actionTypes.FETCH_RESOURCE_DEVICE_VERSION,
      ip,
      data
    };
  },
  upgradeResult: (item, data) => {
    return {
      type: actionTypes.FETCH_RESOURCE_DEVICE_UPGRADE_RESULT,
      item,
      data
    };
  }
};

// const axRequest = {
//   auth: function () {
//     fetch('https://192.168.105.99/axapi/v3/auth', {
//       method: 'POST',
//       body: {credentials :{username: 'admin', password: 'a10'}},
//       header: {
//         'Control-Allow-Origin': '*'
//       }
//     })
//     .then((res) => res.json())
//     .then((body) => {
//       console.log(body);
//     })
//     .catch((err) => {
//         throw new Error(err);
//     });
//   }
// };


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
            dispatch(deviceActions.allVersions(data));
          })
          .catch((err) => {
              throw new Error(err);
          });
    };
  },

  update: (item) => {
    return () => {
      let data = {
        ip: item.ip,
        console: item.console,
        model: item.model,
        product_id_magic: item.product_id_magic,
        vcs_configured: item.vcs_configured,
        is_e2e_machine: item.is_e2e_machine,
        can_send_traffic: item.can_send_traffic,
        release: item.release,
        build: item.build,
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
          .then(() => {
              let info = {
                      user: data.locked_by,
                      ip: data.ip
                    };
              if (data.locked_by) {
                notify('lock device', info);
              } else {
                notify('release device', info);
              }
          })
          .catch((err) => {
              throw new Error(err);
          });
    };
  },
  release: () => {
    return (dispatch) => {
      let config = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.token
        }
      };
      return fetch(SERVER_BASIC_URL + 'getReleases', config)
          .then((res) => res.json())
          .then((body) => {
            dispatch(fetchData.release(body));
          })
          .catch((err) => {
              throw new Error(err);
          });
    };
  },
  upgrade: (item) => {
    return (dispatch) => {
      let config = {
        method: 'POST',
        body: `{
          "ip": "${item.ip}",
          "release": "${item.release}",
          "build": "${item.build}",
          "image": "${item.image}",
          "fpga": "${item.firmware_version}"
        }`,
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.token
        }
      };
      console.log(config);
      return fetch(SERVER_BASIC_URL + 'upgrade', config)
          .then((res) => res.json())
          .then((body) => {
            if (body) {
              dispatch(fetchData.upgradeResult(item, body));
            }
          })
          .catch((err) => {
              throw new Error(err);
          });
    };
  },
  allVersions: (data) => {
    return (dispatch) => {
      data.map((device) => {
          dispatch(deviceActions.version(device.ip));
      });
    };
  },
  version: (ip) => {
    return (dispatch) => {
      let config = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.token
        }
      };
      return fetch(SERVER_BASIC_URL + 'getVersion?ip=' + ip, config)
          .then((res) => res.json())
          .then((body) => {
            dispatch(fetchData.version(ip, body));
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
    dispatch(deviceActions.release());
    dispatch(deviceActions.info());
  };
}

export function updateDevice(item){
  return (dispatch) => {
    dispatch(deviceActions.update(item));
  };
}

export function upgradeDevice(item) {
  return (dispatch) => {
    dispatch(deviceActions.upgrade(item));
  };
}



