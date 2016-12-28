/**
 * @author Steven Fong
 */
// Libraries
import { Map, List, fromJS } from 'immutable';
import _ from 'lodash';
// Constants
//
import actionTypes from '../constants/action-types';
import { MENU } from '../constants/menu';
import { TECH_MENU } from '../constants/tec-menu';
import { FEATURE_ANALYSIS_DIFFICULTIES } from '../constants/featureAnalysis';
import {
  sumUpFromChildrenNode,
  generateTree
} from '../libraries/tree';

_.merge(MENU, TECH_MENU);

function transformToTree(dataArr) {
    let root = dataArr.filter((node) => { return !node.parentId; })[0],
        rest = dataArr.filter((node) => { return node.parentId; });
    let tree = generateTree(rest, root, { fullpath: '' }, (node, parent) => {
      const axapiTest = node.axapiTest || [];
      const unitTest = node.unitTest || [];
      const end2endTest = node.end2endTest || [];
      const unitTestAngular = unitTest.filter(item=> item.framework==='angular');
      const unitTestDjango = unitTest.filter(item=> item.framework==='django');

      node.unitTestAngular = unitTestAngular;
      node.unitTestDjango = unitTestDjango;

      return {
        owners: node.owners || [],
        difficulty: node.difficulty || 0,
        fullpath: node.name === 'root' ? 'root' : `${parent.fullpath} > ${node.name}`,
        parentIds: [ ...(parent.parentIds || []), node.id ],
        axapiTestTotalCount: axapiTest.length,
        axapiTestFailCount: axapiTest.filter(item => !item.isSuccess).length,
        unitTestTotalCount: unitTest.length,
        unitTestFailCount: unitTest.filter(item => !item.isSuccess).length,
        unitTestAngularTotalCount: unitTestAngular.length,
        unitTestAngularFailCount: unitTestAngular.filter(item => !item.isSuccess).length,
        unitTestAngularTotalCount: unitTestAngular.length,
        unitTestDjangoTotalCount: unitTestDjango.length,
        unitTestDjangoFailCount: unitTestDjango.filter(item => !item.isSuccess).length,
        unitTestDjangoTotalCount: unitTestDjango.length,
        end2endTestTotalCount: end2endTest.length,
        end2endTestFailCount: end2endTest.filter(item => !item.isSuccess).length
      };
    });
    const initDifficulties = Array.apply(null, { length: FEATURE_ANALYSIS_DIFFICULTIES.length }).map( ()=> 0);
    sumUpFromChildrenNode(tree, {
      init: {
        difficulties: initDifficulties,
        accumOwners: [],
        accumArticlesCount: 0,
        accumAxapiTest: [],
        accumAxapiTestTotalCount: 0,
        accumAxapiTestFailCount: 0,
        accumUnitTest: [],
        accumUnitTestTotalCount: 0,
        accumUnitTestFailCount: 0,
        accumUnitTestAngular: [],
        accumUnitTestAngularTotalCount: 0,
        accumUnitTestAngularFailCount: 0,
        accumUnitTestDjango: [],
        accumUnitTestDjangoTotalCount: 0,
        accumUnitTestDjangoFailCount: 0,
        accumEnd2endTest: [],
        accumEnd2endTestTotalCount: 0,
        accumEnd2endTestFailCount: 0,
      },
      siblingMerge(prev, current) {
        let difficulties;
        if (current.difficulty != null) {
          difficulties = prev.difficulties.map((eachDiffculties, index)=> {
            const isLeaf = !current.children || current.children.length === 0;
            return eachDiffculties + (
              current.difficulties ? current.difficulties[index] : 0
            ) + (
              current.difficulty === index && isLeaf ? 1 : 0
            );
          });
        }

        return {
          difficulties: difficulties,
          accumOwners: prev.accumOwners.concat(current.owners, current.accumOwners || []),
          accumArticlesCount: prev.accumArticlesCount + (current.articlesCount || 0),
          accumAxapiTest: prev.accumAxapiTest.concat(current.axapiTest),
          accumAxapiTestTotalCount: prev.accumAxapiTestTotalCount + current.axapiTestTotalCount,
          accumAxapiTestFailCount: prev.accumAxapiTestFailCount + current.axapiTestFailCount,
          accumUnitTest: prev.accumUnitTest.concat(current.unitTest),
          accumUnitTestTotalCount: prev.accumUnitTestTotalCount + current.unitTestTotalCount,
          accumUnitTestFailCount: prev.accumUnitTestFailCount + current.unitTestFailCount,
          accumUnitTestAngular: prev.accumUnitTestAngular.concat(current.unitTestAngular),
          accumUnitTestAngularTotalCount: prev.accumUnitTestAngularTotalCount + current.unitTestAngularTotalCount,
          accumUnitTestAngularFailCount: prev.accumUnitTestAngularFailCount + current.unitTestAngularFailCount,
          accumUnitTestDjango: prev.accumUnitTestDjango.concat(current.unitTestDjango),
          accumUnitTestDjangoTotalCount: prev.accumUnitTestDjangoTotalCount + current.unitTestDjangoTotalCount,
          accumUnitTestDjangoFailCount: prev.accumUnitTestDjangoFailCount + current.unitTestDjangoFailCount,
          accumEnd2endTest: prev.accumEnd2endTest.concat(current.end2endTest),
          accumEnd2endTestTotalCount: prev.accumEnd2endTestTotalCount + current.end2endTestTotalCount,
          accumEnd2endTestFailCount: prev.accumEnd2endTestFailCount + current.end2endTestFailCount,
        };
      },
      childrenParentMerge(childrenResult, parent) {
        return {
          difficulties: childrenResult.difficulties,
          accumOwners: Array.from(new Set(childrenResult.accumOwners)),
          articlesCount: childrenResult.accumArticlesCount + (parent.articlesCount || 0),
          axapiTest: (parent.axapiTest || []).concat(childrenResult.accumAxapiTest),
          axapiTestTotalCount: childrenResult.accumAxapiTestTotalCount + parent.axapiTestTotalCount,
          axapiTestFailCount: childrenResult.accumAxapiTestFailCount + parent.axapiTestFailCount,
          unitTest: (parent.unitTest || []).concat(childrenResult.accumUnitTest),
          unitTestTotalCount: childrenResult.accumUnitTestTotalCount + parent.unitTestTotalCount,
          unitTestFailCount: childrenResult.accumUnitTestFailCount + parent.unitTestFailCount,
          unitTestAngular: (parent.unitTestAngular || []).concat(childrenResult.accumUnitTestAngular),
          unitTestAngularTotalCount: childrenResult.accumUnitTestAngularTotalCount + parent.unitTestAngularTotalCount,
          unitTestAngularFailCount: childrenResult.accumUnitTestAngularFailCount + parent.unitTestAngularFailCount,
          unitTestDjango: (parent.unitTestDjango || []).concat(childrenResult.accumUnitTestDjango),
          unitTestDjangoTotalCount: childrenResult.accumUnitTestDjangoTotalCount + parent.unitTestDjangoTotalCount,
          unitTestDjangoFailCount: childrenResult.accumUnitTestDjangoFailCount + parent.unitTestDjangoFailCount,
          end2endTest: (parent.end2endTest || []).concat(childrenResult.accumEnd2endTest),
          end2endTestTotalCount: childrenResult.accumEnd2endTestTotalCount + parent.end2endTestTotalCount,
          end2endTestFailCount: childrenResult.accumEnd2endTestFailCount + parent.end2endTestFailCount
        };
      }
    });
    return tree;
}

const initialState = Map({
  documentCategoriesWithReportTest: Map({}),
  documentCategoriesWithSettings: Map({}),
  flatDocumentCategoriesWithSettings: [],
  flatDocumentCategoriesWithReportTest: [],
  unitTestCreatedTimeList: List.of(),
  end2endTestCreatedTimeList: List.of(),
  axapiTestCreatedTimeList: List.of(),
  testReportAxapiSuggestions: List.of(),
  filterOwner: null,
  filterRelease: null,
  filterCase: null,
  searchCategoryName: '',
  isLoading: false,
  createdUtDocId: null
});

export default function featureAutomationReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.CREATE_ARTICLE:
    case actionTypes.FETCH_DOCUMENT_CATEGORIES_WITH_REPORT_TEST:
    case actionTypes.FETCH_DOCUMENT_CATEGORIES_WITH_SETTINGS:
      return state.set('isLoading', true);
    case actionTypes.FETCH_DOCUMENT_CATEGORIES_WITH_REPORT_TEST_FAIL:
    case actionTypes.FETCH_DOCUMENT_CATEGORIES_WITH_SETTINGS_FAIL:
    case actionTypes.CREATE_ARTICLE_FAIL:
    case actionTypes.SETUP_TEST_REPORT_OF_CATEGORY_FAIL:
      return state.set('isLoading', false);
    case actionTypes.CREATE_ARTICLE_SUCCESS:
      return state.set('isLoading', false)
        .set('createdUtDocId', action.id);
    case actionTypes.FETCH_DOCUMENT_CATEGORIES_WITH_REPORT_TEST_SUCCESS:
      return state.set('flatDocumentCategoriesWithReportTest', action.data)
        .set('documentCategoriesWithReportTest', fromJS(transformToTree(action.data)))
        .set('isLoading', false);
    case actionTypes.SETUP_TEST_REPORT_OF_CATEGORY_SUCCESS:
      if (!action.data) { return state; }
      const flatDocumentCategoriesWithReportTest = state.get('flatDocumentCategoriesWithReportTest')
        .map( item => item.id === action.data.id ?  Object.assign({}, item, action.data) : item );
      return state.set('flatDocumentCategoriesWithReportTest', flatDocumentCategoriesWithReportTest)
        .set('documentCategoriesWithReportTest', fromJS(transformToTree(flatDocumentCategoriesWithReportTest)))
        .set('isLoading', false);
    case actionTypes.FETCH_DOCUMENT_CATEGORIES_WITH_SETTINGS_SUCCESS:
      return state.set('documentCategoriesWithSettings', fromJS(transformToTree(action.data)))
        .set('flatDocumentCategoriesWithSettings', action.data)
        .set('isLoading', false);
    case actionTypes.FETCH_DOCUMENT_CATEGORY_WITH_SETTINGS_SUCCESS:
      const flatDocumentCategoriesWithSettings = state.get('flatDocumentCategoriesWithSettings')
        .map( item => item.id === action.data.id ? action.data : item );
      return state.set('flatDocumentCategoriesWithSettings', flatDocumentCategoriesWithSettings)
        .set('documentCategoriesWithSettings', fromJS(transformToTree(flatDocumentCategoriesWithSettings)));
    case actionTypes.FETCH_TEST_REPORT_CREATED_TIME_LIST_SUCCESS:
      return state.set('unitTestCreatedTimeList', List(action.unitTestCreatedTimeList))
        .set('end2endTestCreatedTimeList', List(action.end2endTestCreatedTimeList))
        .set('axapiTestCreatedTimeList', List(action.axapiTestCreatedTimeList));
    case actionTypes.FILTER_TEST_REPORT:
      let resultState = state;
      if (action.hasOwnProperty('filterOwner')) {
        resultState = resultState.set('filterOwner', action.filterOwner);
      }
      if (action.hasOwnProperty('filterRelease')) {
        resultState = resultState.set('filterRelease', action.filterRelease);
      }
      if (action.hasOwnProperty('filterCase')) {
        resultState = resultState.set('filterCase', action.filterCase);
      }
      return resultState;
    case actionTypes.FETCH_TEST_REPORT_AXAPI_SUGGESTIONS_SUCCESS:
      return state.set('testReportAxapiSuggestions', List(action.testReportAxapiSuggestions));
    case actionTypes.SEARCH_AUTOMATION_CATEGORY_BY_NAME:
      return state.set('searchCategoryName', action.searchCategoryName);
    default:
      return state;
  }
};
