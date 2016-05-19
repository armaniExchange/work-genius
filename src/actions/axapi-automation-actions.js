// Libraries
import fetch from 'isomorphic-fetch';
// import 'fs';
// let fs = this.get('fs');
// import 'path';
// let path = this.get('path');
// Constants
import actionTypes from '../constants/action-types';
import { SERVER_AXAPI_AUTOMATION_API_URL } from '../constants/config';

let _convertModDiffFilePath = (filePath) => { //filePath should be '4_1_1/cli_schema_diff_result/rule-set.sch'
  if (filePath.substr(0,1)==='/') { //just defensive
    filePath = filePath.substr(1);
  }
  return 'mod_diff--' + filePath.replace(/\//g, 'ZZZZ'); //should be mod_diff--4_1_1ZZZZcli_schema_diff_resultZZZZrule-set.sch
};

let jsonBuildDetail = (build, dels, mods, news, curMod, curModFile, tab) => {
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

let jsonBuilds = (builds) => {
  return {
    builds
  };
};

let jsonProducts = (products) => {
  return {
    products
  };
};
console.log(jsonBuildDetail, jsonBuilds, jsonProducts);

let axapiAutomationApi = (handle, conf={}) => {
  return (dispatch) => {
    let config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', //<----
        'x-access-token': localStorage.token
      }
    };
    let url = SERVER_AXAPI_AUTOMATION_API_URL;
    url += `?handle=${handle}`;
    console.log('conf', conf);
    for (let [k, v] of Object.entries(conf)) {
      url += `&${k}=${v}`;
    }
    return fetch(url, config)
      .then((res) => res.json())
      .then((body) => {
        console.log(dispatch);
        console.log('body-------', body);
        let data = body && body.data;
        switch (handle) {
          case 'FETCH_PRODUCT':
            dispatch({
              type: actionTypes.AXAPIAUTO_FETCH_PRODUCT_SUCCESS,
              products: data.products
              // ...jsonProducts(data.products),
              // ...jsonBuilds(data.builds),
              // ...jsonBuildDetail(data.build, data.dels, data.mods, data.news, data.curMod)
            });
          break;
          case 'FETCH_BUILD_NUMBER':
            dispatch({
              type: actionTypes.AXAPIAUTO_FETCH_BUILD_NUMBER_SUCCESS,
              builds: data.builds
              // ...jsonBuildDetail(data.build, data.dels, data.mods, data.news, data.curMod)
            });
          break;
          case 'CHANGE_PRODUCT': /** TODO */
            dispatch({
              type: actionTypes.CHANGE_PRODUCT_NUMBER_SUCCESS,
              // ...jsonBuilds(data.builds),
              // ...jsonBuildDetail(data.build, data.dels, data.mods, data.news, data.curMod)
            });
          break;
          case 'CHANGE_BUILD_NUMBER':
          case 'CHANGE_TAB':
            let _type = actionTypes.AXAPIAUTO_CHANGE_BUILD_NUMBER_SUCCESS;
            if (handle==='CHANGE_TAB') {
              _type = actionTypes.AXAPIAUTO_CHANGE_TAB_SUCCESS;
            }
            dispatch({
              type: _type,
              ...jsonBuildDetail(data.build, data.dels, data.mods, data.news, data.curMod,
                data.curModFile,
                conf.tab, //should be 'TAB___*'
                )
            });
          break;
          case 'CHANGE_MODIFIED_FILENAME':
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
  return axapiAutomationApi('FETCH_BUILD_NUMBER', {product});
};
export function changeBuildNumber(product, build, tab) {
  return axapiAutomationApi('CHANGE_BUILD_NUMBER', {product, build, tab});
};

export function fetchProduct() {
  return axapiAutomationApi('FETCH_PRODUCT');
};
export function changeProduct(product) {
  // TODO
  return axapiAutomationApi('CHANGE_PRODUCT', {product});
};

export function changeTabPage(tab, product, build) {
  return axapiAutomationApi('CHANGE_TAB', {tab, product, build});
};

export function changeModifiedFileName(filename, product, tab, build) {
  filename = _convertModDiffFilePath(filename);
  return axapiAutomationApi('CHANGE_MODIFIED_FILENAME', {filename, product, tab, build});
}

//how to changeProduct and buildNumber at once.
