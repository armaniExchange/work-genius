import { SERVER_FILES_URL } from '../constants/config';

export function getFileUrl(id) {
  return `${SERVER_FILES_URL}/${id}`;
}

export function appendFileUrlToFiles(files) {
  return files.map(file => {
    return Object.assign({}, file, {url: getFileUrl(file.id)});
  });
}

