import actionTypes from '../constants/action-types';
import {
  SERVER_API_URL,
  SERVER_FILES_URL
} from '../constants/config';
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

function _fetchArticle(id) {
  let config = {
    method: 'POST',
    body: `{
      getArticle (id: "${id}") {
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
          category: {id: categories_id[0]},
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
    newArticle.categories_id = [newArticle.category.id];
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
    type: actionTypes.UPDATE_ARTICLE_FAIL,
    error
  };
}


export function updateArticle(newArticle) {
  return dispatch => {
    dispatch({
      type: actionTypes.UPDATE_ARTICLE
    });
    newArticle.categories_id = [newArticle.category.id];
    newArticle.content = newArticle.content.replace(/\n/g, '\\n');

    // update to server
    const config = {
      method: 'POST',
      body: `
        mutation RootMutationType {
          updateArticle (
            id: "${newArticle.id}"
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

export function deleteArticleSuccess(id) {
  return {
    type: actionTypes.DELETE_ARTICLE_SUCCESS,
    id
  };
}

export function deleteArticle(id) {
  return dispatch => {
    dispatch({
      type: actionTypes.DELETE_ARTICLE
    });
    const config = {
      method: 'POST',
      body: `
        mutation RootMutationType {
          deleteArticle (
            id: "${id}"
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
        dispatch(deleteArticleSuccess(id));
      })
      .catch((error) => {
        dispatch(updateArticleFail(error));
      });
  };
}

export function uploadArticleFileSuccess(tempId, file) {
  return {
    type: actionTypes.UPLOAD_ARTICLE_FILE_SUCCESS,
    tempId,
    file
  };
}

export function uploadArticleFileProgress(tempId, event) {
  return {
    type: actionTypes.UPLOAD_ARTICLE_FILE_PROGRESS,
    tempId,
    event
  };
}

let _tempArticleFileId = 0;
export function uploadArticleFile(file) {
  return dispatch => {
    _tempArticleFileId++;
    const tempId = _tempArticleFileId;
    dispatch({
      type: actionTypes.UPLOAD_ARTICLE_FILE,
      file: {
        tempId,
        name: file.name,
        type: file.type
      }
    });
    // server response with true id and file detailed without data
    sendFile({
      file,
      url: SERVER_FILES_URL,
      headers: {
        'x-access-token': localStorage.token
      },
      progress(event) {
        dispatch(uploadArticleFileProgress(tempId, {
          loaded: event.loaded || event.position,
          total: event.total
        }));
      },
    })
    .then((xhr)=> {
      const data = JSON.parse(xhr.responseText);
      dispatch(uploadArticleFileSuccess(tempId, data));
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
