import actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';

export function fetchArticlesFail(error) {
  return {
    type: actionTypes.FETCH_ARTICLES_FAIL,
    error
  };
}

export function fetchArticlesSuccess(articleList) {
  return {
    type: actionTypes.FETCH_ARTICLES_SUCCESS,
    articleList
  };
}

export function fetchArticles(query) {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_ARTICLES
    });

    console.log(query);
    let config = {
      method: 'POST',
      body: `{
        getAllArticles {
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
          created_at,
          updated_at
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
        dispatch(fetchArticlesSuccess(body.data.getAllArticles.map(article => {
          const {
            id,
            title,
            content,
            tags,
            author,
            comments,
            created_at,
            updated_at
          } = article;
          return {
            id,
            title,
            content,
            tags,
            author,
            comments,
            createdAt: parseInt(created_at), // remove this when ready
            updatedAt: parseInt(updated_at) // remove this when server respond with current
          };
        })));
      })
      .catch((error) => {
        dispatch(fetchArticlesFail(error));
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

    let config = {
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
    // fetch categoreis from server
    let config = {
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
      });
  };
}
