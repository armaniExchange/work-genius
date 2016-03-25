import actionTypes from '../constants/action-types';
import { SERVER_API_URL } from '../constants/config';
import {SERVER_FILE_URL} from '../constants/config';
import sendFile from '../libraries/sendFile';


export function fetchArticleSucess(article) {
  return {
    type: actionTypes.FETCH_ARTICLE_SUCCESS,
    ...article
  };
}

export function fetchArticleFail(error) {
  return {
    type: actionTypes.FETCH_ARTICLE_FAIL,
    error
  };
}

function _fetchArticle(articleId) {
  let config = {
    method: 'POST',
    body: `{
      getArticle (article_id: "${articleId}") {
        id,
        title,
        content,
        tags,
        categories_id,
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
  return fetch(SERVER_API_URL, config);
}

export function fetchArticle(articleId) {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_ARTICLE,
      id: articleId
    });
    // fetch from server

    return _fetchArticle(articleId)
      .then((res) => {
        if (res.status >= 400) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((body) => {
        const {
          id,
          title,
          content,
          tags,
          author,
          categories_id,
          comments,
          created_at,
          updated_at
        } = body.data.getArticle;
        const article = {
          id,
          title,
          content,
          tags,
          author,
          category: {id: categories_id},
          comments,
          createdAt: parseInt(created_at), // remove this when ready
          updatedAt: parseInt(updated_at) // remove this when server respond with current
        };
        dispatch(fetchArticleSucess(article));
      })
      .catch((error) => {
        dispatch(fetchArticleFail(error));
      });
  };
}

export function createArticleSuccess(article) {
  return {
    type: actionTypes.CREATE_ARTICLE_SUCCESS,
    ...article
  };
}

export function createArticleFail(error) {
  return {
    type: actionTypes.CREATE_ARTICLE_FAIL,
    error
  };
}

export function createArticle(newArticle) {
  return dispatch => {
    dispatch({
      type: actionTypes.CREATE_ARTICLE,
      ...newArticle
    });
    // post to server

    const config = {
      method: 'POST',
      body: `
        mutation RootMutationType {
          createArticle ( data: "${JSON.stringify(newArticle).replace(/"/g, '\\"')}")
        }
      `,
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
        const id = body.data.createArticle;
        dispatch(createArticleSuccess({id}));
        return _fetchArticle(id);
      })
      .catch((error) => {
        dispatch(createArticleFail(error));
      });
  };
}

export function updateArticleSuccess(article) {
  return {
    type: actionTypes.UPDATE_ARTICLE_SUCCESS,
    ...article
  };
}

export function updateArticleFail(error) {
  return {
    type: actionTypes.UPDATE_ARTICLE_SUCCESS,
    error
  };
}


export function updateArticle(newArticle) {
  return dispatch => {
    dispatch({
      type: actionTypes.UPDATE_ARTICLE
    });
    // update to server
    const config = {
      method: 'POST',
      body: `
        mutation RootMutationType {
          editArticle (
            articleId: "${newArticle.id}"
            data: "${JSON.stringify(newArticle).replace(/"/g, '\\"')}"
          ),
        }
      `,
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
        const id = body.data.editArticle;
        dispatch(updateArticleSuccess({id}));
      })
      .catch((error) => {
        dispatch(updateArticleFail(error));
      });
  };
}

export function deleteArticleSuccess(articleId) {
  return {
    type: actionTypes.DELETE_ARTICLE_SUCCESS,
    id: articleId
  };
}

export function deleteArticle(articleId) {
  return dispatch => {
    dispatch({
      type: actionTypes.DELETE_ARTICLE
    });
    const config = {
      method: 'POST',
      body: `
        mutation RootMutationType {
          deleteArticle (
            articleId: "${articleId}"
          ),
        }
      `,
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
        dispatch(deleteArticleSuccess(articleId));
      })
      .catch((error) => {
        dispatch(updateArticleFail(error));
      });
  };
}

export function uploadArticleFileSuccess(file) {
  return {
    type: actionTypes.UPLOAD_ARTICLE_FILE_SUCCESS,
    file
  };
}

export function uploadArticleFile(file) {
  return dispatch => {
    dispatch({
      type: actionTypes.UPLOAD_ARTICLE_FILE
    });
    // server response with true id and file detailed without data
    sendFile({
      file,
      url: SERVER_FILE_URL,
      headers: {
        'x-access-token': localStorage.token
      }
    })
    .then((xhr)=> {
      const data = JSON.parse(xhr.responseText);
      dispatch(uploadArticleFileSuccess(data));
    });
  };
}

export function removeArticleFileSuccess(fileId) {
  return {
    type: actionTypes.REMOVE_ARTICLE_FILE_SUCCESS,
    id: fileId
  };
}

export function removeArticleFile(fileId) {
  return dispatch => {
    dispatch({
      type: actionTypes.REMOVE_ARTICLE_FILE,
      id: fileId
    });
    dispatch(removeArticleFileSuccess(fileId));
  };
}

export function clearArticle() {
  return {
    type: actionTypes.CLEAR_ARTICLE
  };
}
