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
import {
  sumUpFromChildrenNode,
  generateTree
} from '../libraries/tree';

_.merge(MENU, TECH_MENU);

function transformToTree(dataArr) {
    let root = dataArr.filter((node) => { return !node.parentId; })[0],
        rest = dataArr.filter((node) => { return node.parentId; });
    let tree = generateTree(rest, root, {}, (node) => {
      const axapiTest = node.axapiTest || [];
      const unitTest = node.unitTest || [];
      const end2endTest = node.end2endTest || [];

      return {
        axapiTestTotalCount: axapiTest.length,
        axapiTestFailCount: axapiTest.filter(item => !item.isSuccess).length,
        unitTestTotalCount: unitTest.length,
        unitTestFailCount: unitTest.filter(item => !item.isSuccess).length,
        end2endTestTotalCount: end2endTest.length,
        end2endTestFailCount: end2endTest.filter(item => !item.isSuccess).length
      };
    });
    sumUpFromChildrenNode(tree, {
      init: {
        accumArticlesCount: 0,
        accumAxapiTest: [],
        accumAxapiTestTotalCount: 0,
        accumAxapiTestFailCount: 0,
        accumUnitTest: [],
        accumUnitTestTotalCount: 0,
        accumUnitTestFailCount: 0,
        accumEnd2endTest: [],
        accumEnd2endTestTotalCount: 0,
        accumEnd2endTestFailCount: 0,
      },
      siblingMerge(prev, current) {
        return {
          accumArticlesCount: prev.accumArticlesCount + (current.articlesCount || 0),
          accumAxapiTest: prev.accumAxapiTest.concat(current.axapiTest),
          accumAxapiTestTotalCount: prev.accumAxapiTestTotalCount + current.axapiTestTotalCount,
          accumAxapiTestFailCount: prev.accumAxapiTestFailCount + current.axapiTestFailCount,
          accumUnitTest: prev.accumUnitTest.concat(current.unitTest),
          accumUnitTestTotalCount: prev.accumUnitTestTotalCount + current.unitTestTotalCount,
          accumUnitTestFailCount: prev.accumUnitTestFailCount + current.unitTestFailCount,
          accumEnd2endTest: prev.accumEnd2endTest.concat(current.end2endTest),
          accumEnd2endTestTotalCount: prev.accumEnd2endTestTotalCount + current.end2endTestTotalCount,
          accumEnd2endTestFailCount: prev.accumEnd2endTestFailCount + current.end2endTestFailCount,
        };
      },
      childrenParentMerge(childrenResult, parent) {
        return {
          articlesCount: childrenResult.accumArticlesCount + (parent.articlesCount || 0),
          axapiTest: (parent.axapiTest || []).concat(childrenResult.accumAxapiTest),
          axapiTestTotalCount: childrenResult.accumAxapiTestTotalCount + parent.axapiTestTotalCount,
          axapiTestFailCount: childrenResult.accumAxapiTestFailCount + parent.axapiTestFailCount,
          unitTest: (parent.unitTest || []).concat(childrenResult.accumUnitTest),
          unitTestTotalCount: childrenResult.accumUnitTestTotalCount + parent.unitTestTotalCount,
          unitTestFailCount: childrenResult.accumUnitTestFailCount + parent.unitTestFailCount,
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
  unitTestCreatedTimeList: List.of(),
  end2endTestCreatedTimeList: List.of(),
  axapiTestCreatedTimeList: List.of()
});

export default function featureAutomationReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCH_DOCUMENT_CATEGORIES_WITH_REPORT_TEST_SUCCESS:
      return state.set('documentCategoriesWithReportTest', fromJS(transformToTree(action.data)));
    case actionTypes.FETCH_TEST_REPORT_CREATED_TIME_LIST_SUCCESS:
      return state.set('unitTestCreatedTimeList', List(action.unitTestCreatedTimeList))
        .set('end2endTestCreatedTimeList', List(action.end2endTestCreatedTimeList))
        .set('axapiTestCreatedTimeList', List(action.axapiTestCreatedTimeList));
    default:
      return state;
  }
};
