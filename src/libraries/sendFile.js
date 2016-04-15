export default function sendFile({file, url, headers, progress }) {
  return new Promise((resolve, reject) => {
    var XHR = new XMLHttpRequest();

    var formData = new FormData();
    formData.append('file', file);

    XHR.addEventListener('load', event => {
      resolve(event.currentTarget);
    });
    XHR.addEventListener('error', reject);
    XHR.upload.addEventListener('progress', progress, false);
    XHR.open('POST', url);

    for (let key in headers) {
      if (headers.hasOwnProperty(key)) {
        XHR.setRequestHeader(key, headers[key]);
      }
    }
    XHR.send(formData);
  });
};
