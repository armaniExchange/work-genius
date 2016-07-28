// Libraries
import fetch from 'isomorphic-fetch';
// import 'fs';
// let fs = this.get('fs');
// import 'path';
// let path = this.get('path');
// Constants
import actionTypes from '../constants/action-types';
import { SERVER_AXAPI_AUTOMATION_API_URL } from '../constants/config';

const _convertModDiffFilePath = (filePath) => { //filePath should be '4_1_1/cli_schema_diff_result/rule-set.sch'
  if (filePath.substr(0,1)==='/') { //just defensive
    filePath = filePath.substr(1);
  }
  return 'mod_diff--' + filePath.replace(/\//g, 'ZZZZ'); //should be mod_diff--4_1_1ZZZZcli_schema_diff_resultZZZZrule-set.sch
};

const jsonBuildDetail = (build, dels, mods, news, curMod, curModFile, tab) => {
  return {
    build,
    dels, // s means filenames
    mods,
    news,
    curMod,
    curModFile,
    tab
  };
};

const jsonBuilds = (builds) => {
  return {
    builds
  };
};

const jsonProducts = (products) => {
  return {
    products
  };
};
console.log(jsonBuildDetail, jsonBuilds, jsonProducts);

const axapiAutomationApi = (handle, conf={}) => {
  return (dispatch) => {
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', //<----
        'x-access-token': localStorage.token
      }
    };
    let url = SERVER_AXAPI_AUTOMATION_API_URL;
    url += handle + '/';
    console.log('conf', conf);
    for (let [k, v] of Object.entries(conf)) {
      url += url.indexOf('?')===-1 ? '?' : '&';
      url += `${k}=${v}`;
    }
    console.log('handle', handle, url);
    return fetch(url, config)
      .then((res) => res.json())
      .then((body) => {
        console.log(dispatch);
        console.log('body-------', body);
        const data = body && body.data;
        switch (handle) {
          case 'fetch_product':
            dispatch({
              type: actionTypes.AXAPIAUTO_FETCH_PRODUCT_SUCCESS,
              products: data.products
              // ...jsonProducts(data.products),
              // ...jsonBuilds(data.builds),
              // ...jsonBuildDetail(data.build, data.dels, data.mods, data.news, data.curMod)
            });
          break;
          case 'fetch_build_number':
            dispatch({
              type: actionTypes.AXAPIAUTO_FETCH_BUILD_NUMBER_SUCCESS,
              builds: data.builds
              // ...jsonBuildDetail(data.build, data.dels, data.mods, data.news, data.curMod)
            });
          break;
          case 'change_product': /** TODO */
            dispatch({
              type: actionTypes.CHANGE_PRODUCT_NUMBER_SUCCESS,
              // ...jsonBuilds(data.builds),
              // ...jsonBuildDetail(data.build, data.dels, data.mods, data.news, data.curMod)
            });
          break;
          case 'change_build_number':
          case 'change_tab':
            let _type = actionTypes.AXAPIAUTO_CHANGE_BUILD_NUMBER_SUCCESS,
                obj;
            if (handle==='change_tab') {
              _type = actionTypes.AXAPIAUTO_CHANGE_TAB_SUCCESS;
            }
            console.log('_type', _type);

            if (conf.tab==='TAB___API') {
              console.warn('-----------data', data);
              obj = {
                type: _type,
                tab: conf.tab,
                ...data
                // aryAPI: data.aryAPI,
                // total: data.total,
                // curPage: data.curPage
              };
            } else {
              obj = {
                type: _type,
                ...jsonBuildDetail(data.build, data.dels, data.mods, data.news, data.curMod,
                  data.curModFile,
                  conf.tab, //should be 'TAB___*'
                  )
              };
            }
            console.log('obj...........', obj);
            dispatch(obj);
          break;
          case 'change_modified_filename':
            dispatch({
              type: actionTypes.AXAPIAUTO_CHANGE_MODIFIED_FILENAME_SUCCESS,
              modifiedContent: data.modifiedContent,
              modifiedFilename: data.modifiedFilename
            });
          break;
        }
      });
  };
};

export function fetchBuildNumber(product) { //async
  return axapiAutomationApi('fetch_build_number', {product});
};
export function changeBuildNumber(product, build, tab) {
  return axapiAutomationApi('change_build_number', {product, build, tab});
};

export function fetchProduct() {
  return axapiAutomationApi('fetch_product');
};
export function changeProduct(product) {
  // TODO
  return axapiAutomationApi('change_product', {product});
};

export function changeTabPage(tab, product, build, conf={}) {
  console.log('changeTabPage', tab, product, build);
  if (tab==='TAB___API') {
    return axapiAutomationApi('change_tab', {tab, product, ...conf});
  }
  return axapiAutomationApi('change_tab', {tab, product, build});
};

export function changeModifiedFileName(filename, product, tab, build) {
  filename = _convertModDiffFilePath(filename);
  return axapiAutomationApi('change_modified_filename', {filename, product, tab, build});
}

//how to changeProduct and buildNumber at once.
