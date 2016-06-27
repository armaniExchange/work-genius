import fs from 'fs';
import path from 'path';
import r from 'rethinkdb';
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

const API_DATA_PAGESIZE = 10;
const DATA_FOLDER = 'axapi_automation_data';
const DATA_ABS_PATH = path.resolve(__dirname, '..', '..', '..', DATA_FOLDER) + '/'; 
const CODE_SUCC = 0;
const VALID_TAB = ['TAB___CLI', 'TAB___JSON', 'TAB___API'];
const TAB_MAPPING_FOLDER = {'TAB___CLI':'cli', 'TAB___JSON':'json', 'TAB___API':'api'};

const _getAllProduct = () => {
  return fs.readdirSync(DATA_ABS_PATH).map((val)=>{
    return {title: val, value: val};
  });
};
const _getAllBuildNumber = (productValue) => {
  return fs.readdirSync(DATA_ABS_PATH + productValue).sort((a,b)=> a-b).map((val)=>{
    return {title: val, value: val};
  });
};

const _getFileNameOnly = (filePath) => {
  return filePath.split('/').slice(-1)[0];
};

const _getModifiedDiffFileName = (schemaFilePath) => { // schemaFilePath is from the content of mod.txt 
  return 'mod_diff--' + schemaFilePath.replace(/\//g, 'ZZZZ');
};
const _readDiffStatusFileContent = (diffFilename, productValue, build, tab) => {
  // diffFilename should be 'new.txt' 'del.txt' 'mod.txt' or 'mod_diff--*.txt' (see _getModifiedDiffFileName)
  // console.log('start _readDiffStatusFileContent');
  const _path = DATA_ABS_PATH + productValue + '/' + build + '/' + tab + '/';
  console.log('_readDiffStatusFileContent _path', _path);
  console.log('diffFilename', diffFilename);
  const content = fs.readFileSync(_path + diffFilename, 'utf8');
  // console.log('content-----', content, content.length);
  return content;
};

const _getDiffStatusFileList = (diffFilename, productValue, build, tab) => {
  // diffFilename should be 'new.txt' 'del.txt' 'mod.txt'
  // console.log('_getDiffStatusFileList start _readDiffStatusFileContent');
  const content = _readDiffStatusFileContent(diffFilename, productValue, build, tab);
  const ary = content.split("\n");
  // console.log('content---', content);
  let ret = [];
  for (let i=0, len=ary.length; i<len; i++) {
    let ln = ary[i];
    let mark = '';
    for (let k in {"\tdeleted:":1, "\tnew file:":1, "\tmodified:":1}) {
      if (ln.indexOf(k)===0) {
        mark = k;
        break;
      }
    }
    if (mark==='') {continue;}
    let filename = ln.replace(mark,'').trim();
    ret.push(filename);
  }
  return ret;
};

const _getDataWithModifiedContent = (product, build, tab) => {
  let dels = [];
  let mods = [];
  let news = [];
  let curMod = '';
  let filePath = '';
  if (build) {
    dels = _getDiffStatusFileList('del.txt', product, build, tab);
    mods = _getDiffStatusFileList('mod.txt', product, build, tab);
    news = _getDiffStatusFileList('new.txt', product, build, tab);
    if (mods && mods.length) {
      filePath = mods[0];
      curMod = _readDiffStatusFileContent(
        _getModifiedDiffFileName(filePath),
        product,
        build,
        tab
        );
    }
  }

  const data = {
    build: build,
    dels: dels,
    mods: mods,
    news: news,
    curMod: curMod,
    curModFile: filePath ? _getFileNameOnly(filePath) : ''
  };
  return data;
};

export const fetchProductHandler = async (req, res) => {
  const allProduct = _getAllProduct();
  // let allBuilds = allProduct && allProduct.length ? _getAllBuildNumber(allProduct[0].value) : [];
  // let build = allBuilds.length ? allBuilds[0].value : '';
  // let dels = [];
  // let mods = [];
  // let news = [];
  // let curMod = '';
  // if (build) {
  //   let productValue = allProduct[0].value;
  //   dels = _getDiffStatusFileList('del.txt', productValue, build, tab);
  //   mods = _getDiffStatusFileList('mod.txt', productValue, build, tab);
  //   news = _getDiffStatusFileList('new.txt', productValue, build, tab);
  // }

  res.json({'code':CODE_SUCC, 'data':{
    products:allProduct
    // ,
    // builds: allBuilds,
    // build: build,
    // dels: dels,
    // mods: mods,
    // news: news,
    // curMod: curMod
  }});
};
export const fetchBuildNumberHandler = async (req, res) => {
  const { product } = req.query || {};
  if (!product) {
    res.json({'code':CODE_SUCC, 'data':[], 'msg':'product is required!'});
  }
  // console.log('product', product, DATA_ABS_PATH+product);
  const allBuildNumber = _getAllBuildNumber(product);
  // console.log('allBuildNumber', allBuildNumber);
  res.json({'code':CODE_SUCC, 'data':{builds: allBuildNumber, product: product}});
};

export const changeProductHandler = async (req, res) => {

};
export const changeBuildNumberHandler = async (req, res) => {
  const {
    tab,
    product,
    build
  } = req.query || {}
  if (!tab || !product || !build) {
    res.json({'code':CODE_SUCC, 'data':[], 'msg':'tab, product AND build are required!'});
  };
  console.log('product, build, tab', product, build, tab);
  const tabFolder = TAB_MAPPING_FOLDER[tab];
  const data = _getDataWithModifiedContent(product, build, tabFolder);
  // console.log('data-----------', data);
  res.json({'code':CODE_SUCC, 'data':data});
};
export const changeModifiedFilenameHandler = async (req, res) => {
  const {
    filename,
    product,
    build,
    tab
  } = req.query || {};
  if (!filename || !tab || VALID_TAB.indexOf(req.query.tab)===-1 || !product || !build) {
    res.json({'code':CODE_SUCC, 'data':[], 'msg':'filename, tab, product AND build are required!'});
  };

  const tabFolder = TAB_MAPPING_FOLDER[tab];

  // console.log('--------------', filename, tab, product, build);
  const modifiedContent = _readDiffStatusFileContent(filename, product, build, tabFolder);
  const filenameRecover = filename.replace('mod_diff--', '').replace(/ZZZZ/g, '/');
  const modifiedFilename = _getFileNameOnly(filenameRecover);
  res.json({'code':CODE_SUCC, 'data':{modifiedContent: modifiedContent, modifiedFilename: modifiedFilename}});
};

export const changeTabHandler = async (req, res) => {
  const {
    product,
    curAPIResultCreatedTime,
    build,
    tab,
    apiPage
  } = req.query || {};
  const IS_TAB_API = tab==='TAB___API';

  if (!tab || VALID_TAB.indexOf(req.query.tab)===-1 || !product) {
    if (IS_TAB_API) {
      if (!curAPIResultCreatedTime) {
        res.json({'code':CODE_SUCC, 'data':[], 'msg':'tab, product AND curAPIResultCreatedTime are required!'});
      }
    } else {
      if (!build) {
        res.json({'code':CODE_SUCC, 'data':[], 'msg':'tab, product AND build are required!'});
      }
    }
  };

  if (IS_TAB_API) {
    console.log('TAB___API-----------------------here');
    let aryAPI = [], // only store fail API results
        connection = null,
        query = null,
        results = null,
        PAGESIZE = API_DATA_PAGESIZE,
        startPage = apiPage || 1,
        total;

    try {
        const filteredQuery = () => {
          return r.db('work_genius')
                .table('axapi_test_reports')
                .filter({'createdAt':1466053870000 //<---curAPIResultCreatedTime
                        , 'isSuccess':false}) //Only fail is needed to show.
                ;
        };
        connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        query = filteredQuery()
                .skip((startPage-1)*PAGESIZE)
                .limit(PAGESIZE)
                .coerceTo('array');
        results = await query.run(connection);
        query = filteredQuery()
                .count();
        total = await query.run(connection);
        await connection.close();
        // console.log(results);
        aryAPI = results;
    } catch (err) {
        console.log(err);
        console.log(`Fail to create category! Error!`);
    }
    console.log(aryAPI);
    res.json({'code':CODE_SUCC, 'data':{
      aryAPI: aryAPI,
      total: total,
      curPage: startPage,
      createdAt: 1466053870000
    }});
    return;
  }

  const tabFolder = TAB_MAPPING_FOLDER[tab];
  console.log('--------------', tab, tabFolder, product, build);
  
  const data = _getDataWithModifiedContent(product, build, tabFolder);
  res.json({'code':CODE_SUCC, 'data':data});
};
