import stringifyObject from '../libraries/stringifyObject';

import actionTypes from '../constants/action-types';
import {
  SERVER_API_URL,
  SERVER_FILES_URL
} from '../constants/config';
import sendFile from '../libraries/sendFile';
import {
    setLoadingState,
    apiFailure
} from './app-actions';

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
        category {id},
        author {
          id,
          name
        },
        comments {
          id,
          title,
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
    dispatch(setLoadingState(true));

    return _fetchArticle(articleId)
      .then((res) => {
        if (res.status >= 400) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((body) => {
        if (body.errors) {
          throw new Error(JSON.stringify(body.errors));
        }
        dispatch(fetchArticleSucess(body.data.getArticle));
        dispatch(setLoadingState(false));
      })
      .catch((error) => {
        dispatch(fetchArticleFail(error));
        dispatch(apiFailure(error));
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
    dispatch(setLoadingState(true));

    const config = {
      method: 'POST',
      body: `
        mutation RootMutationType {
          createArticle ( article: ${stringifyObject(newArticle)}) {
            id
          }
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
        if (body.errors) {
          throw new Error(JSON.stringify(body.errors));
        }
        const id = body.data.createArticle.id;
        dispatch(createArticleSuccess({id}));
        dispatch(setLoadingState(false));
        return _fetchArticle(id);
      })
      .catch((error) => {
        dispatch(createArticleFail(error));
        dispatch(apiFailure(error));
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
    dispatch(setLoadingState(true));

    const config = {
      method: 'POST',
      body: `
        mutation RootMutationType {
          updateArticle ( article: ${stringifyObject(newArticle)}) {
            id
          }
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
        if (body.errors) {
          throw new Error(JSON.stringify(body.errors));
        }
        const id = body.data.updateArticle.id;
        dispatch(updateArticleSuccess({id}));
        dispatch(setLoadingState(false));
      })
      .catch((error) => {
        dispatch(updateArticleFail(error));
        dispatch(apiFailure(error));
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
      .then((body) => {
        if (body.errors) {
          throw new Error(JSON.stringify(body.errors));
        }
        dispatch(deleteArticleSuccess(id));
      })
      .catch((error) => {
        dispatch(updateArticleFail(error));
        dispatch(apiFailure(error));
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

export function uploadArticleFileFail(error) {
  return {
    type: actionTypes.UPLOAD_ARTICLE_FILE_FAIL,
    error
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
export function uploadArticleFile({articleId, file, files}) {
  let uploadedFile;
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
    .then((xhr) => {
      uploadedFile = JSON.parse(xhr.responseText);
      if (!articleId) { // new article
        dispatch(uploadArticleFileSuccess(tempId, uploadedFile));
        return;
      }

      const updatedArticle = {
        id: articleId,
        files: [...files, uploadedFile].map(eachFile => {return {id: eachFile.id};})
      };
      const config = {
        method: 'POST',
        body: `
          mutation RootMutationType {
            updateArticle ( article: ${stringifyObject(updatedArticle)}) {id}
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
          if (body.errors) {
            throw new Error(JSON.stringify(body.errors));
          }
          dispatch(uploadArticleFileSuccess(tempId, uploadedFile));
        });
    })
    .catch((error) => {
      dispatch(uploadArticleFileFail(error));
      dispatch(apiFailure(error));
    });
  };
}

export function removeArticleFileSuccess(fileId) {
  return {
    type: actionTypes.REMOVE_ARTICLE_FILE_SUCCESS,
    id: fileId
  };
}

export function removeArticleFileFail(error) {
  return {
    type: actionTypes.REMOVE_ARTICLE_FILE_FAIL,
    error
  };
}

export function removeArticleFile({articleId, file, files}) {
  return dispatch => {
    const fileId = file.id;

    dispatch({
      type: actionTypes.REMOVE_ARTICLE_FILE,
      id: fileId
    });

    fetch(`${SERVER_FILES_URL}/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/graphql',
          'x-access-token': localStorage.token
        }
      })
      .then((res) => {
        if (res.status >= 400) {
          throw new Error(res.statusText);
        }
        if (!articleId) {
          dispatch(removeArticleFileSuccess(fileId));
          return;
        }
        const updatedArticle = {
          id: articleId,
          files: files.filter((eachFile) => {
            return eachFile.id !== file.id;
          })
          .map(eachFile => {return {id: eachFile.id};})
        };
        const config = {
          method: 'POST',
          body: `
            mutation RootMutationType {
              updateArticle ( article: ${stringifyObject(updatedArticle)}) {id}
            }
           `,
           headers: {
            'Content-Type': 'application/graphql',
            'x-access-token': localStorage.token
           }
        };
        fetch(SERVER_API_URL, config)
          .then((res2)=> {
            if (res2.status >= 400) {
              throw new Error(res.statusText);
            }
            return res2.json();
          })
          .then((body) => {
            if (body.errors) {
              throw new Error(JSON.stringify(body.errors));
            }
            dispatch(removeArticleFileSuccess(fileId));
          });
      })
      .catch((error) => {
        dispatch(removeArticleFileFail(error));
        dispatch(apiFailure(error));
      });
  };
}

export function clearArticle() {
  return {
    type: actionTypes.CLEAR_ARTICLE
  };
}
