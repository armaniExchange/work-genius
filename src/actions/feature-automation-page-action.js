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

export function fetchDocumentCategoriesWithReportFail(error) {
  return {
    type: actionTypes.FETCH_DOCUMENT_CATEGORIES_WITH_REPORT_TEST_FAIL,
    error
  };
}

export function fetchDocumentCategoriesWithReport(query) {
  return dispatch => {
    const {
      unitTestCreatedTime,
      end2endTestCreatedTime,
      axapiTestCreatedTime
    } = query || {};
    dispatch({
      type: actionTypes.FETCH_DOCUMENT_CATEGORIES_WITH_REPORT_TEST
    });
    let queryCreatedTime = '';
    queryCreatedTime += typeof unitTestCreatedTime !== 'undefined' ? `unitTestCreatedTime:${unitTestCreatedTime} `: '';
    queryCreatedTime += typeof end2endTestCreatedTime !== 'undefined' ? `end2endTestCreatedTime:${end2endTestCreatedTime} ` : '';
    queryCreatedTime += typeof axapiTestCreatedTime !== 'undefined' ? `axapiTestCreatedTime:${axapiTestCreatedTime} ` : '';
    queryCreatedTime = queryCreatedTime === '' ? queryCreatedTime : `(\n${queryCreatedTime}\n)`;

    const config = {
      method: 'POST',
      body: `{
        getAllDocumentCategoriesWithTestReport ${queryCreatedTime} {
          id,
          parentId,
          name,
          articlesCount,
          path,
          axapis,
          owners,
          difficulty,
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
        if (body.errors) {
          throw new Error(body.erros);
        }
        const { getAllDocumentCategoriesWithTestReport } = body.data;
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


export function setupTestReportOfCategory({categoryId, path, axapis, owners, difficulty}) {
  return dispatch => {
    dispatch(setLoadingState(true));
    dispatch({
      type: actionTypes.SETUP_TEST_REPORT_OF_CATEGORY
    });

    let queryString = '';
    queryString += typeof path !== 'undefined' ? `path: "${path.replace(/\\/g, '\\\\')}",` : '';
    queryString += typeof axapis !== 'undefined' ? `axapis: ${stringifyObject(axapis)},` : '';
    queryString += typeof owners !== 'undefined' ? `owners: ${stringifyObject(owners)}` : '';
    queryString += typeof difficulty !== 'undefined' ? `difficulty: ${difficulty}` : '';

    const config = {
      method: 'POST',
      body: `mutation RootMutationType {
        setupTestReportOfCategory (
          categoryId: "${categoryId}",
          ${queryString}
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
        dispatch(setupTestReportOfCategorySuccess());
        dispatch(setLoadingState(false));
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
        if (body.errors) {
          throw new Error(body.erros);
        }
        const { getTestReportCreatedTimeList } = body.data;
        dispatch(setLoadingState(false));
        dispatch(fetchTestReportCreatedTimeListSuccess(getTestReportCreatedTimeList));
      })
      .catch((error) => {
        dispatch(apiFailure(error));
      });
  };
}

export function fetchTestReportAxapiSuggestionsSuccess(testReportAxapiSuggestions) {
  return {
    type: actionTypes.FETCH_TEST_REPORT_AXAPI_SUGGESTIONS_SUCCESS,
    testReportAxapiSuggestions
  };
}

export function fetchTestReportAxapiSuggestions() {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_TEST_REPORT_AXAPI_SUGGESTIONS
    });
    const config = {
      method: 'POST',
      body: `{ getTestReportAxapiSuggestion }`,
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
        if (body.errors) {
          throw new Error(body.erros);
        }
        const { getTestReportAxapiSuggestion } = body.data;
        dispatch(fetchTestReportAxapiSuggestionsSuccess(getTestReportAxapiSuggestion));
      })
      .catch((error) => {
        dispatch(apiFailure(error));
      });

  };
}

export function filterTestReport(filters) {

  return dispatch => {
    const { filterOwner, filterRelease, filterCase } = filters;
    dispatch(Object.assign(
      { type: actionTypes.FILTER_TEST_REPORT },
      filters.hasOwnProperty('filterOwner') ? { filterOwner } : null,
      filters.hasOwnProperty('filterRelease') ? { filterRelease } : null,
      filters.hasOwnProperty('filterCase') ? { filterCase } : null
    ));
  };
}

export function searchAutomationCategoryByName(searchCategoryName) {
  return dispatch => {
    dispatch({
      type: actionTypes.SEARCH_AUTOMATION_CATEGORY_BY_NAME,
      searchCategoryName
    });
  };
}

