import stringifyObject from 'stringify-object';

export default function (obj, options) {
  return stringifyObject(obj, Object.assign({singleQuotes: false}, options));
}
