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
let _readDiffStatusFileContent = (diffFilename, productValue, build) => {
  // diffFilename should be 'new.txt' 'del.txt' 'mod.txt' or 'mod_diff--*.txt' (see _getModifiedDiffFileName)
  let _path = DATA_ABS_PATH + productValue + '/' + build + '/';
  let content = fs.readFileSync(_path + diffFilename);
  return content;
};

let _getDiffStatusFileList = (diffFilename, productValue, build) => {
  // diffFilename should be 'new.txt' 'del.txt' 'mod.txt'
  let content = _readDiffStatusFileContent(diffFilename, productValue, build);
  let ary = content.split("\n");
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
  //   dels = _getDiffStatusFileList('del.txt', productValue, build);
  //   mods = _getDiffStatusFileList('mod.txt', productValue, build);
  //   news = _getDiffStatusFileList('new.txt', productValue, build);
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

};
