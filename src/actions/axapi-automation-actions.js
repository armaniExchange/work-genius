// Libraries
import fetch from 'isomorphic-fetch';
// import 'fs';
// let fs = this.get('fs');
// import 'path';
// let path = this.get('path');
// Constants
import actionTypes from '../constants/action-types';
import { SERVER_AXAPI_AUTOMATION_API_URL } from '../constants/config';



let jsonBuildDetail = (build, dels, mods, news, curMod) => {
  return {
    build,
    dels, // s means filenames
    mods,
    news,
    curMod,
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
            dispatch({
              type: actionTypes.AXAPIAUTO_CHANGE_BUILD_NUMBER_SUCCESS,
              ...jsonBuildDetail(data.build, data.dels, data.mods, data.news, data.curMod)
            });
          break;
        }
      });
  };
};

export function fetchBuildNumber(product) { //async // (deprecated comment) auto-select first build AND return build detail
  return axapiAutomationApi('FETCH_BUILD_NUMBER', {product});
};
export function changeBuildNumber(product, build, tab) { // (deprecated comment) return build detail
  return axapiAutomationApi('CHANGE_BUILD_NUMBER', {product, build, tab});
};

export function fetchProduct() { // (deprecated comment) return all products AND return all builds AND auto-select first build AND return build detail
  return axapiAutomationApi('FETCH_PRODUCT');
};
export function changeProduct(product) { // (deprecated comment) return all builds AND auto-select first build AND return build detail
  // TODO
  return axapiAutomationApi('CHANGE_PRODUCT', {product});
};

export function changeTabPage(tab) { // (deprecated comment) return all builds AND auto-select first build AND return build detail
  // return axapiAutomationApi('CHANGE_PRODUCT', {product});
  return {
    type: actionTypes.AXAPIAUTO_CHNAGE_TAB,
    tab
  };
};

//how to changeProduct and buildNumber at once.
