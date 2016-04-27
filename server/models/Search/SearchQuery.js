import r from 'rethinkdb';
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

const ES_HOST = '192.168.95.138:9200'
const ES_INDEX = 'kb';
const ES_TYPE_ARTICLES = 'articles';
const ES_TYPE_FILES = 'files';

let elasticsearch = require('elasticsearch');
let client = new elasticsearch.Client({
  host: ES_HOST
  //, log: 'trace'
});

let KbElastic = {
  // _decorateFromSize: (searchObj, _from, _size) => {
  //   return Object.assign({}, searchObj, {

  //   })
  // },
  REGEXP_NUMBER: /^[0-9]+$/,
  isValidFromSize: (val) => {
    return typeof val==='number' && REGEXP_NUMBER.exec(val+'');
  },
  getSearchObj: (setting) => {
    let obj = {
        index: ES_INDEX,
        type: setting.typeName //ES_TYPE_ARTICLES,
      };

    if (setting.q) {
      obj.q = setting.q;
    }

    obj.body = setting.body || {};
    if (KbElastic.isValidFromSize(setting.from)) {
      obj.from = setting.from;
    }
    if (KbElastic.isValidFromSize(setting.size)) {
      obj.size = setting.size;
    }

    return obj;
  },
  jsonResult: (result) => {
    const hasHit = result.hits && result.hits.hits && result.hits.hits.length;
  
    return {
      total: hasHit ? result.hits.total : 0,
      hits: hasHit ? result.hits.hits : []
    };
  }
};

let ArticleElastic = {
  search: async (q, opt={}) => {
    opt.typeName = ES_TYPE_ARTICLES;
    opt.q = q;
    let ret = await client.search(KbElastic.getSearchObj(opt));
    return KbElastic.jsonResult(ret);
  }
};
let FileElastic = {
  search: async (q, opt={}) => {
    opt.typeName = ES_TYPE_FILES;
    opt.q = q;
    let ret = await client.search(KbElastic.getSearchObj(opt));
    return KbElastic.jsonResult(ret);
  }
};

let responseSearch = async (req, res, searchMethod) => {
  let searchq = req.query && req.query.searchq;
  let start = req.query && req.query.start; // from
  let count = req.query && req.query.count; // size
  if (searchq) {
    searchq = encodeURIComponent(searchq);
    try {
      res.json({'code':0, 'data': await searchMethod.apply(null, [searchq]) });
    } catch (err) {
      res.json({'err': err});
    }

  } else {
    res.json({'code':0, 'data':null});
  }
};

export const searchArticleHandler = async (req, res) => {
  responseSearch(req, res, ArticleElastic.search);
};
export const searchFileHandler = async (req, res) => {
  responseSearch(req, res, FileElastic.search);
};

/*
export const searchFileHandler = async (req, res) => {
  let searchq = req.query && req.query.searchq;
  let start = req.query && req.query.start; // from
  let count = req.query && req.query.count; // size
  if (searchq) {
    searchq = encodeURIComponent(searchq);
    try {
      res.json({'code':0, 'data': await ArticleElastic.search(searchq)});
    } catch (err) {
      res.json({'err': err});
    }

  } else {
    res.json({'code':0, 'data':[]});
  }
};
*/
