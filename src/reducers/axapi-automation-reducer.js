import actionTypes from '../constants/action-types';
import { Map } from 'immutable';

const DEFAULT_CURRENT_PRODUCT = '';
const DEFAULT_CURRENT_BUILD = '';
const DEFAULT_CURRENT_TAB = 'TAB___CLI'; //'TAB___JSON' //'TAB___API'
const initialState = Map({
  currentTabPage: DEFAULT_CURRENT_TAB,
  aryProduct: [],
  curProduct: DEFAULT_CURRENT_PRODUCT,
  aryBuildNumber: [],
  curBuildNumber: DEFAULT_CURRENT_BUILD,

  aryDelFiles: [],
  aryModFiles: [],
  aryNewFiles: [],
  curModifiedFilename: '',
  curModifiedDiff: ''
});

// defined UI behavior
export default function searchReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.AXAPIAUTO_CHNAGE_TAB:
      return state.set('currentTabPage', action.tab);
    case actionTypes.AXAPIAUTO_FETCH_PRODUCT_SUCCESS:
      const products = action.products;
      const curProduct = products && products.length ? products[0].title : DEFAULT_CURRENT_PRODUCT;
      return state.set('aryProduct', products)
                .set('curProduct', curProduct);
    case actionTypes.AXAPIAUTO_FETCH_BUILD_NUMBER_SUCCESS:
      const builds = action.builds;
      const curBuildNumber = builds && builds.length ? builds[0].title : DEFAULT_CURRENT_BUILD;
      return state.set('aryBuildNumber', builds)
                .set('curBuildNumber', curBuildNumber);
    case actionTypes.AXAPIAUTO_CHANGE_PRODUCT_SUCCESS:
      return state.set('curProduct', action.product)
                  .set('aryBuildNumber', action.builds);
    case actionTypes.AXAPIAUTO_CHANGE_BUILD_NUMBER_SUCCESS:
    case actionTypes.AXAPIAUTO_CHANGE_TAB_SUCCESS:
      console.warn(action);
      return state.set('curBuildNumber', action.build)
                .set('currentTabPage', action.tab)
                .set('aryDelFiles', action.dels)
                .set('aryModFiles', action.mods)
                .set('aryNewFiles', action.news)
                .set('curModifiedFilename', action.curModFile)
                .set('curModifiedDiff', action.curMod);
    case actionTypes.AXAPIAUTO_CHANGE_MODIFIED_FILENAME_SUCCESS:
      return state.set('curModifiedDiff', action.modifiedContent)
                  .set('curModifiedFilename', action.modifiedFilename);
  }
  return state;
}
