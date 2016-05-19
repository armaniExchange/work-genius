import fs from 'fs';
import path from 'path';

const DATA_FOLDER = 'axapi_automation_data';
const DATA_ABS_PATH = path.resolve(__dirname, '..', '..', '..', DATA_FOLDER) + '/'; 
const CODE_SUCC = 0;

let _getAllProduct = () => {
  return fs.readdirSync(DATA_ABS_PATH).map((val)=>{
    return {title: val, value: val};
  });
};
let _getAllBuildNumber = (productValue) => {
  return fs.readdirSync(DATA_ABS_PATH + productValue).map((val)=>{
    return {title: val, value: val};
  });
};

let _getModifiedDiffFileName = (schemaFilePath) => { // schemaFilePath is from the content of mod.txt 
  return 'mod_diff--' + schemaFilePath.replace(/\//g, 'ZZZZ');
};
let _readDiffStatusFileContent = (diffFilename, productValue, build, tab) => {
  // diffFilename should be 'new.txt' 'del.txt' 'mod.txt' or 'mod_diff--*.txt' (see _getModifiedDiffFileName)
  // console.log('start _readDiffStatusFileContent');
  let _path = DATA_ABS_PATH + productValue + '/' + build + '/' + tab + '/';
  console.log('_readDiffStatusFileContent _path', _path);
  console.log('diffFilename', diffFilename);
  let content = fs.readFileSync(_path + diffFilename, 'utf8');
  // console.log('content-----', content, content.length);
  return content;
};

let _getDiffStatusFileList = (diffFilename, productValue, build, tab) => {
  // diffFilename should be 'new.txt' 'del.txt' 'mod.txt'
  // console.log('_getDiffStatusFileList start _readDiffStatusFileContent');
  let content = _readDiffStatusFileContent(diffFilename, productValue, build, tab);
  let ary = content.split("\n");
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

export const fetchProductHandler = async (req, res) => {
  let allProduct = _getAllProduct();
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
  let product = req.query && req.query.product;
  if (!product) {
    res.json({'code':CODE_SUCC, 'data':[], 'msg':'product is required!'});
  }
  // console.log('product', product, DATA_ABS_PATH+product);
  let allBuildNumber = _getAllBuildNumber(product);
  // console.log('allBuildNumber', allBuildNumber);
  res.json({'code':CODE_SUCC, 'data':{builds: allBuildNumber, product: product}});
};

export const changeProductHandler = async (req, res) => {

};
export const changeBuildNumberHandler = async (req, res) => {
  let tab = req.query && req.query.tab;
  let product = req.query && req.query.product;
  let build = req.query && req.query.build;
  if (!tab || !product || !build) {
    res.json({'code':CODE_SUCC, 'data':[], 'msg':'tab, product AND build are required!'});
  };
  console.log('product, build, tab', product, build, tab);

  let dels = [];
  let mods = [];
  let news = [];
  let curMod = '';
  if (build) {
    dels = _getDiffStatusFileList('del.txt', product, build, tab);
    mods = _getDiffStatusFileList('mod.txt', product, build, tab);
    news = _getDiffStatusFileList('new.txt', product, build, tab);
    if (mods && mods.length) {
      curMod = _readDiffStatusFileContent(
        _getModifiedDiffFileName(mods[0]),
        product,
        build,
        tab
        );
    }
  }

  let data = {
    build: build,
    dels: dels,
    mods: mods,
    news: news,
    curMod: curMod
  };
  console.log('data-----------', data);
  res.json({'code':CODE_SUCC, 'data':data});
};
export const changeModifiedFilenameHandler = async (req, res) => {
  let filename = req.query && req.query.filename;
  let product = req.query && req.query.product;
  let build = req.query && req.query.build;
  let tab = req.query && req.query.tab;
  if (!filename || !tab || ['TAB___CLI', 'TAB___JSON', 'TAB___API'].indexOf(req.query.tab)===-1 || !product || !build) {
    res.json({'code':CODE_SUCC, 'data':[], 'msg':'filename, tab, product AND build are required!'});
  };

  tab = ({'TAB___CLI':'cli', 'TAB___JSON':'json', 'TAB___API':'api'})[tab];

  console.log('--------------', filename, tab, product, build);
  let modifiedContent = _readDiffStatusFileContent(filename, product, build, tab);
  let filenameRecover = filename.replace('mod_diff--', '').replace(/ZZZZ/g, '/');
  let modifiedFilename = filenameRecover.split('/').slice(-1)[0];
  res.json({'code':CODE_SUCC, 'data':{modifiedContent: modifiedContent, modifiedFilename: modifiedFilename}});
};
