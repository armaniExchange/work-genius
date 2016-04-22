import actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';
import {
    setLoadingState,
    apiFailure
} from './app-actions';

export function setSelectedCategory(data) {
	return {
		type: actionTypes.SET_SELECTED_CATEGORY,
		data
	};
}

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
      .reduce((previous, key) => previous + `${key}: ${JSON.stringify(query[key])} `, '');
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
            categoryId,
            author {
              id,
              name
            },
            comments {
              id,
              content
            },
            files {
              id,
              type,
              name,
              url
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
      })
      .catch((error) => {
        dispatch(fetchAllTagsFail(error));
        dispatch(apiFailure(error));
      });
  };
}

export function fetchAllUsersFail(error) {
  return {
    type: actionTypes.FETCH_ALL_USERS_FAIL,
    error
  };
}

export function fetchAllUsersSuccess(allUsers) {
  return {
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    allUsers
  };
}

export function fetchAllUsers() {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_ALL_USERS
    });

    const config = {
      method: 'POST',
      body: `{
        allUsers {id, name}
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
        dispatch(fetchAllUsersSuccess(body.data.allUsers));
      })
      .catch((error) => {
        dispatch(fetchAllUsersFail(error));
        dispatch(apiFailure(error));
      });
  };
}


export function fetchAllMilestonesFail(error) {
  return {
    type: actionTypes.FETCH_ALL_MILESTONES_FAIL,
    error
  };
}

export function fetchAllMilestonesSuccess(allMilestones) {
  return {
    type: actionTypes.FETCH_ALL_MILESTONES_SUCCESS,
    allMilestones
  };
}

export function fetchAllMilestones() {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_ALL_MILESTONES
    });

    const config = {
      method: 'POST',
      body: `{
        getAllMilestones
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
        dispatch(fetchAllMilestonesSuccess(body.data.getAllMilestones));
      })
      .catch((error) => {
        dispatch(fetchAllMilestonesFail(error));
        dispatch(apiFailure(error));
      });
  };
}

export function updateArticlesQuery(query) {
  return dispatch => {
    dispatch ({
      type: actionTypes.UPDATE_ARTICLES_QUERY,
      ...query
    });
  };
}
