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
        categoryId,
        author {
          id,
          name
        },
        comments {
          id,
          content,
          createdAt,
          author {
            id,
            name
          },
        },
        files {
          id,
          type,
          name,
          url
        },
        documentType,
        priority,
        milestone,
        reportTo,
        bugStatus,
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

export function createArticle(newArticle, callback= ()=>{}) {
  return dispatch => {
    dispatch({
      type: actionTypes.CREATE_ARTICLE,
      ...newArticle
    });
    dispatch(setLoadingState(true));

    newArticle.title = newArticle.title.replace(/\\/g, '\\\\');
    if (newArticle.content) {
      newArticle.content.replace(/\\/g, '\\\\');
    } else {
      delete newArticle.content;
    }
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
        callback();
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
    if (newArticle.title) {
      newArticle.title = newArticle.title.replace(/\\/g, '\\\\');
    }
    if (newArticle.content) {
      newArticle.content = newArticle.content.replace(/\\/g, '\\\\');
    }
    const config = {
      method: 'POST',
      body: `
        mutation RootMutationType {
          updateArticle ( article: ${stringifyObject(newArticle)}) {
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
              content,
              createdAt,
              author {
                id,
                name
              },
            },
            files {
              id,
              type,
              name,
              url
            },
            documentType,
            priority,
            milestone,
            reportTo,
            bugStatus,
            createdAt,
            updatedAt,
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
        dispatch(updateArticleSuccess(body.data.updateArticle));
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

export function deleteArticleFail(error) {
  return {
    type: actionTypes.DELETE_ARTICLE_FAIL,
    error
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

export function createCommentSuccess(comment) {
  return {
    type: actionTypes.CREATE_COMMENT_SUCCESS,
    comment
  };
}

export function createCommentFail(error) {
  return {
    type: actionTypes.CREATE_COMMENT_FAIL,
    error
  };
}

export function createComment({articleId, comment}) {
  return dispatch => {
    dispatch({
      type: actionTypes.CREATE_COMMENT,
      comment
    });
    dispatch(setLoadingState(true));
    comment.content = comment.content.replace(/\\/g, '\\\\');
    const config = {
      method: 'POST',
      body: `
        mutation RootMutationType {
          createComment( comment: ${stringifyObject(comment)} articleId: "${articleId}") {
            id,
            content,
            updatedAt,
            author {
              id,
              name
            }
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
        dispatch(createCommentSuccess(body.data.createComment));
        dispatch(setLoadingState(false));
      })
      .catch((error) => {
        dispatch(createCommentFail(error));
        dispatch(apiFailure(error));
      });
  };
}

export function updateCommentSuccess(comment) {
  return {
    type: actionTypes.UPDATE_COMMENT_SUCCESS,
    comment
  };
}

export function updateCommentFail(error) {
  return {
    type: actionTypes.UPDATE_COMMENT_FAIL,
    error
  };
}

export function updateComment({articleId, comment}) {
  return dispatch => {
    dispatch({
      type: actionTypes.UPDATE_COMMENT,
      comment
    });
    dispatch(setLoadingState(true));
    comment.content = comment.content.replace(/\\/g, '\\\\');
    const config = {
      method: 'POST',
      body: `
        mutation RootMutationType {
          updateComment( comment: ${stringifyObject(comment)} articleId: "${articleId}") {
            id,
            content,
            updatedAt,
            author {
              id,
              name
            }
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
        dispatch(updateCommentSuccess(body.data.updateComment));
        dispatch(setLoadingState(false));
      })
      .catch((error) => {
        dispatch(updateCommentFail(error));
        dispatch(apiFailure(error));
      });
  };
}

export function deleteCommentSuccess(id) {
  return {
    type: actionTypes.DELETE_COMMENT_SUCCESS,
    id
  };
}

export function deleteCommentFail(error) {
  return {
    type: actionTypes.DELETE_COMMENT_FAIL,
    error
  };
}

export function deleteComment({articleId, id}) {
  return dispatch => {
    dispatch({
      type: actionTypes.DELETE_COMMENT,
      id
    });
    dispatch(setLoadingState(true));

    const config = {
      method: 'POST',
      body: `
        mutation RootMutationType {
          deleteComment( id: "${id}" articleId: "${articleId}")
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
        dispatch(deleteCommentSuccess(id));
        dispatch(setLoadingState(false));
      })
      .catch((error) => {
        dispatch(deleteCommentFail(error));
        dispatch(apiFailure(error));
      });
  };
}

export function fetchDocumentTemplateSuccess(documentTemplate) {
  return {
    type: actionTypes.FETCH_DOCUMENT_TEMPLATE_SUCCESS,
    ...documentTemplate
  };
}

export function fetchDocumentTemplateFail(error) {
  return {
    type: actionTypes.FETCH_DOCUMENT_TEMPLATE_FAIL,
    error
  };
}

export function fetchDocumentTemplate(id) {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_DOCUMENT_TEMPLATE,
      id
    });
    dispatch(setLoadingState(true));

    const config = {
      method: 'POST',
      body: `{
          getDcoumentTemplate( id: "${id}" ) {
            id,
            content
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
          throw new Error(JSON.stringify(body.errors));
        }
        dispatch(fetchDocumentTemplateSuccess(body.data.getDcoumentTemplate));
        dispatch(setLoadingState(false));
      })
      .catch((error) => {
        dispatch(fetchDocumentTemplateFail(error));
        dispatch(apiFailure(error));
      });
  };
}


export function updateDocumentTemplateSuccess(id) {
  return {
    type: actionTypes.UPDATE_DOCUMENT_TEMPLATE_SUCCESS,
    id
  };
}

export function updateDocumentTemplateFail(error) {
  return {
    type: actionTypes.UPDATE_DOCUMENT_TEMPLATE_FAIL,
    error
  };
}

export function updateDocumentTemplate(documentTemplate) {
  return dispatch => {
    dispatch({
      type: actionTypes.UPDATE_DOCUMENT_TEMPLATE,
      documentTemplate
    });
    documentTemplate.content.replace(/\\/g, '\\\\');
    dispatch(setLoadingState(true));

    const config = {
      method: 'POST',
      body: `
        mutation RootMutationType {
          updateDocumentTemplate( documentTemplate: ${stringifyObject(documentTemplate)}) {
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
      .then(() => {
        dispatch(updateDocumentTemplateSuccess(documentTemplate.id));
        dispatch(setLoadingState(false));
      })
      .catch((error) => {
        dispatch(updateDocumentTemplateFail(error));
        dispatch(apiFailure(error));
      });
  };
}
