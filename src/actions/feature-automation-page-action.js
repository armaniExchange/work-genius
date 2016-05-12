import actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';
import {
  setLoadingState,
  apiFailure
} from './app-actions';
import stringifyObject from '../libraries/stringifyObject';

export function fetchDocumentCategoriesWithReportSuccess(data) {
  return {
    type: actionTypes.FETCH_DOCUMENT_CATEGORIES_WITH_REPORT_TEST_SUCCESS,
    data
  };
}

export function fetchDocumentCategoriesWithReport() {
  return dispatch => {
    dispatch(setLoadingState(true));
    dispatch({
      type: actionTypes.FETCH_DOCUMENT_CATEGORIES_WITH_REPORT_TEST
    });
    const config = {
      method: 'POST',
      body: `{
        getAllDocumentCategoriesWithTestReport {
          id,
          parentId,
          name,
          articlesCount,
          path,
          axapis,
          axapiTest { isSuccess, errorMessage, api },
          unitTest { isSuccess, errorMessage, path },
          end2endTest { isSuccess, errorMessage, path }
        }
      }`,
      headers: {
        'Content-Type': 'application/graphql',
        'x-access-token': localStorage.token
      }
    };
    return fetch(SERVER_API_URL, config)
      .then((res) => {
        if (res.status >= 400) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((body) => {
        const { getAllDocumentCategoriesWithTestReport } = body.data;
        dispatch(setLoadingState(false));
        dispatch(fetchDocumentCategoriesWithReportSuccess(getAllDocumentCategoriesWithTestReport));
      })
      .catch((error) => {
        dispatch(apiFailure(error));
      });
  };
}

export function setupTestReportOfCategorySuccess() {
  return {
    type: actionTypes.SETUP_TEST_REPORT_OF_CATEGORY_SUCCESS
  };
}


export function setupTestReportOfCategory({categoryId, path, axapis}) {
  return dispatch => {
    dispatch(setLoadingState(true));
    dispatch({
      type: actionTypes.SETUP_TEST_REPORT_OF_CATEGORY
    });

    let pathOrAxapis = '';
    pathOrAxapis += typeof path !== 'undefined' ? `path: "${path.replace(/\\/g, '\\\\')}",` : '';
    pathOrAxapis += typeof axapis !== 'undefined' && axapis.length > 0 ? `axapis: ${stringifyObject(axapis)},` : '';

    const config = {
      method: 'POST',
      body: `mutation RootMutationType {
        setupTestReportOfCategory (
          categoryId: "${categoryId}",
          ${pathOrAxapis}
        )
      }`,
      headers: {
        'Content-Type': 'application/graphql',
        'x-access-token': localStorage.token
      }
    };
    return fetch(SERVER_API_URL, config)
      .then((res) => {
        if (res.status >= 400) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(() => {
        dispatch(fetchDocumentCategoriesWithReport());
        // dispatch(setLoadingState(false));
        dispatch(setupTestReportOfCategorySuccess());
      })
      .catch((error) => {
        dispatch(apiFailure(error));
      });
  };
}


export function fetchTestReportCreatedTimeListSuccess(data) {
  const {
    unitTestCreatedTimeList,
    end2endTestCreatedTimeList,
    axapiTestCreatedTimeList
  } = data;
  return {
    type: actionTypes.FETCH_TEST_REPORT_CREATED_TIME_LIST_SUCCESS,
    unitTestCreatedTimeList,
    end2endTestCreatedTimeList,
    axapiTestCreatedTimeList
  };
}

export function fetchTestReportCreatedTimeList() {
  return dispatch => {
    dispatch(setLoadingState(true));
    dispatch({
      type: actionTypes.FETCH_TEST_REPORT_CREATED_TIME_LIST
    });
    const config = {
      method: 'POST',
      body: `{
        getTestReportCreatedTimeList {
          unitTestCreatedTimeList,
          end2endTestCreatedTimeList,
          axapiTestCreatedTimeList
        }
      }`,
      headers: {
        'Content-Type': 'application/graphql',
        'x-access-token': localStorage.token
      }
    };
    return fetch(SERVER_API_URL, config)
      .then((res) => {
        if (res.status >= 400) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((body) => {
        const { getTestReportCreatedTimeList } = body.data;
        dispatch(setLoadingState(false));
        dispatch(fetchTestReportCreatedTimeListSuccess(getTestReportCreatedTimeList));
      })
      .catch((error) => {
        dispatch(apiFailure(error));
      });
  };
}
