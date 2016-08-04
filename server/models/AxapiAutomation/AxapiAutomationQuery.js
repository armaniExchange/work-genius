import fs from 'fs';
import path from 'path';
import r from 'rethinkdb';
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';
import exec from 'child_process'

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
const _getAllBuildNumber = (productValue, tab) => {
  const IS_TAB_API = tab==='TAB___API';
  const _convertItem = (val) => {
    return {title: val, value: val};
  };
  
  if (tab==='TAB___API') {
    return [70,95].map(val=>_convertItem(val));  // will no need
  }

  //CLI|JSON
  return fs.readdirSync(DATA_ABS_PATH + productValue).sort((a,b)=> a-b).map((val)=>_convertItem(val));
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

const _getTabAPIData = async (req, apiPage, product, build, curAPIResultCreatedTime=0) => {
  let aryAPI = [], // only store fail API results
      connection = null,
      query = null,
      results = null,
      PAGESIZE = API_DATA_PAGESIZE,
      startPage = apiPage || 1,
      total,
      isSuccessFilterValue = false, //Only fail is needed to show in GUI Page.
      aryCreatedAt = [],
      maxCreatedAt = 0,
      _createdAt = 0;

  try {
      connection = await r.connect({ host: DB_HOST, port: DB_PORT });
      let resultGroupCreatedAt = await r.db('work_genius')
              .table('axapi_test_reports')
              .filter({'isSuccess': isSuccessFilterValue})
              .group('createdAt')
              .run(connection);
      // console.log('resultGroupCreatedAt=========', resultGroupCreatedAt);
      if (resultGroupCreatedAt.length > 0) {
        for(let i=0;i<resultGroupCreatedAt.length;i++) {
          if (resultGroupCreatedAt[i].group > maxCreatedAt) {
            maxCreatedAt = resultGroupCreatedAt[i].group;
          }
          aryCreatedAt.push(resultGroupCreatedAt[i].group);
        }        
      }
      console.log(maxCreatedAt, aryCreatedAt);        

      let objFilter = {'isSuccess':isSuccessFilterValue, product};  //Only fail is needed to show in GUI Page.
      // if (build) { // remove support build for TAB___API
      //   objFilter['build'] = build; //<--- DBFieldName VS queryKeyName
      // }
      objFilter['createdAt'] = 0; //default
      if (+curAPIResultCreatedTime<=0) { // <------ if 0, auto-pick latest createdAt
        objFilter['createdAt'] = maxCreatedAt;
      } else {
        objFilter['createdAt'] = curAPIResultCreatedTime; //<--pick the createdAt from request query; This value SHOULD be in aryCreatedAt.
      }
      console.log('objFilter', objFilter, req.query);
      const filteredQuery = r.db('work_genius')
              .table('axapi_test_reports')
              .filter(objFilter)
              ;
      
      query = filteredQuery
              .skip((startPage-1)*PAGESIZE)
              .limit(PAGESIZE)
              .coerceTo('array');
      results = await query.run(connection);

      query = filteredQuery
              .count();
      total = await query.run(connection);
      await connection.close();

      console.log(results, total, aryAPI);
      aryAPI = results;
      _createdAt = objFilter['createdAt'];
  } catch (err) {
      console.log(`=========== _getTabAPIData Error! ================`);
      console.log(err);
  }
  console.log(aryAPI);
  const _data = {
    build,
    aryAPI: aryAPI,
    total: total,
    curPage: startPage,
    aryCreatedAt: aryCreatedAt,
    createdAt: +_createdAt
  };
  return _data;
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
  const { product, tab } = req.query || {};
  if (!product || !tab) {
    res.json({'code':CODE_SUCC, 'data':[], 'msg':'product and tab are required!'});
  }
  let allBuildNumber;
  // console.log('product', product, DATA_ABS_PATH+product);
  allBuildNumber = _getAllBuildNumber(product, tab);
  // console.log('allBuildNumber', allBuildNumber);
  res.json({'code':CODE_SUCC, 'data':{builds: allBuildNumber, product: product}});
};

export const changeProductHandler = async (req, res) => {
  //TODO
};
export const changeCreatedAtHandler = async (req, res) => { //so far, only for TAB___API
  const {
    tab,
    product,
    build,
    createdAt,
    apiPage
  } = req.query || {};

  let data = await _getTabAPIData(req, apiPage, product, build, createdAt);
  res.json({'code':CODE_SUCC, 'data':data});
};
export const changeBuildNumberHandler = async (req, res) => {
  const {
    tab,
    product,
    build,
    createdAt,
    apiPage
  } = req.query || {};
  if (!tab || !product) { //  ||!build
    res.json({'code':CODE_SUCC, 'data':[], 'msg':'tab, product are required!'});
  };
  const IS_TAB_API = tab==='TAB___API';
  console.log('product, build, tab = ', product, build, tab, IS_TAB_API);
  let data = {};
  if (IS_TAB_API) { //<---should be deprecated, because there is no `build` dropdown-list in TAB___API
    data = await _getTabAPIData(req, apiPage, product, build, createdAt);
  } else { // TAB-CLI & TAB-JSON
  const tabFolder = TAB_MAPPING_FOLDER[tab];
  data = _getDataWithModifiedContent(product, build, tabFolder);
  }
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
    curAPIResultCreatedTime, //<--API //deprecated in TAB___API because we also can use build for changing.
    build, //<-- CLI and JSON
    tab,
    apiPage
  } = req.query || {};
  const IS_TAB_API = tab==='TAB___API';

  if (!tab || VALID_TAB.indexOf(req.query.tab)===-1 || !product) {
      if (!build) {
        res.json({'code':CODE_SUCC, 'data':[], 'msg':'tab, product AND build are required!'});
      }
  };

  if (IS_TAB_API) {
    console.log('TAB___API-----------------------here');
    
    res.json({'code':CODE_SUCC, 'data': await _getTabAPIData(req, apiPage, product, build, curAPIResultCreatedTime)});
    return;
  }

  const tabFolder = TAB_MAPPING_FOLDER[tab];
  console.log('--------------', tab, tabFolder, product, build);
  
  const data = _getDataWithModifiedContent(product, build, tabFolder);
  res.json({'code':CODE_SUCC, 'data':data});
};
