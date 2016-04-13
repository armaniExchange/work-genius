import actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';
import {
    setLoadingState,
    apiFailure
} from './app-actions';

export function fetchArticlesFail(error) {
  return {
    type: actionTypes.FETCH_ARTICLES_FAIL,
    error
  };
}

export function fetchArticlesSuccess(articleList, count) {
  return {
    type: actionTypes.FETCH_ARTICLES_SUCCESS,
    articleList,
    count
  };
}

export function fetchArticles(query = {}) {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_ARTICLES
    });
    dispatch(setLoadingState(true));

    let queryString = Object.keys(query)
      .reduce((previous, key) => previous + `${key}: ${query[key]} `, '');
    if (queryString !== '') {
      queryString = `(${queryString})`;
    }
    const config = {
      method: 'POST',
      body: `{
        getAllArticles ${queryString} {
          articles {
            id,
            title,
            content,
            tags,
            author {
              id,
              name
            },
            comments {
              id,
              title,
              content
            },
            createdAt,
            updatedAt
          },
          count
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
        dispatch(fetchArticlesSuccess(body.data.getAllArticles.articles, body.data.getAllArticles.count));
        dispatch(setLoadingState(false));
      })
      .catch((error) => {
        dispatch(fetchArticlesFail(error));
        dispatch(apiFailure(error));
      });

    // // get data from server
    // if (!query) {
    //   dispatch(fetchArticlesSuccess(fakeArticleList));
    //   return;
    // }
    // let result;
    // if (query.tag) {
    //   result = fakeArticleList.filter((article) => {
    //     return article.tags.indexOf(query.tag) !== -1;
    //   });
    //   dispatch(fetchArticlesSuccess(result));
    //   return;
    // }
    // if (query.q) {
    //   result = fakeArticleList.filter((article) => {
    //     return article.content.indexOf(query.q) !== -1 || article.author.name.indexOf(query.q) !== -1 || article.title.indexOf(query.q) !== -1;
    //   });
    //   dispatch(fetchArticlesSuccess(result));
    //   return;
    // }
  };
}

export function fetchAllCategoriesFail(error) {
  return {
    type: actionTypes.FETCH_ALL_CATEGORIES_FAIL,
    error
  };
}

export function fetchAllCategoriesSuccess(allCategories) {
  return {
    type: actionTypes.FETCH_ALL_CATEGORIES_SUCCESS,
    allCategories
  };
}

export function fetchAllCategories() {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_ALL_CATEGORIES
    });
    dispatch(setLoadingState(true));

    const config = {
      method: 'POST',
      body: `{
        allCategories {
          id,
          parentId,
          name,
          articlesCount,
          path
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
        dispatch(fetchAllCategoriesSuccess(body.data.allCategories));
        dispatch(setLoadingState(false));
      })
      .catch((error) => {
        dispatch(fetchAllCategoriesFail(error));
        dispatch(apiFailure(error));
      });
  };
}

export function fetchAllTagsFail(error) {
  return {
    type: actionTypes.FETCH_ALL_TAGS_SUCCESS,
    error
  };
}

export function fetchAllTagsSuccess(allTags) {
  return {
    type: actionTypes.FETCH_ALL_TAGS_SUCCESS,
    allTags
  };
}

export function fetchAllTags() {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_ALL_TAGS
    });
    dispatch(setLoadingState(true));
    // fetch categoreis from server
    const config = {
      method: 'POST',
      body: `{
        tags
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
        dispatch(fetchAllTagsSuccess(body.data.tags));
        dispatch(setLoadingState(true));
      })
      .catch((error) => {
        dispatch(fetchAllTagsFail(error));
        dispatch(apiFailure(error));
      });
  };
}
