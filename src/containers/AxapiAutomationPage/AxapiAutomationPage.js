// Style
import './_AxapiAutomationPage.css';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import { bindActionCreators } from 'redux';
// Actions
import * as AxapiAutomationPageActions from '../../actions/axapi-automation-actions';
import DropDownList from '../../components/A10-UI/Input/Drop-Down-List.js';
import HighlightMarkdown from '../../components/HighlightMarkdown/HighlightMarkdown';
import Pagination from 'rc-pagination';

const API_DATA_PAGESIZE = 10;

// let _convertTab = (tab) => {
//   let mapping = {'TAB___CLI':'cli', 'TAB___JSON':'json', 'TAB___API':'api'};
//   tab = mapping[tab];
//   return tab;
// };
const _convertDiffContent = (content) => {
  return '```diff\n' + content + '\n```';
};

/*
let colorfulDiff = (plainTextDiff) => {
  let ret = plainTextDiff.replace(/\n/g, '<br />')
              .replace(/^(-.*)/g, '<strong style="color:red">$1</strong>')
              .replace(/^(\+.*)/g, '<strong style="color:green">$1</strong>');
  return ret;
};*/

const DiffLabelTag = (props) => {
  const _style = {padding:'3px 16px', textAlign:'center', color:'#333', background:'#ccc', 'margin': '0 6px 0 0'};
  if (props.emphasize) {
    _style.color = '#fff';
    _style.background = '#b00';
  }
  return <span style={_style}>{props.children}</span>;
};
DiffLabelTag.propTypes = {
  emphasize: PropTypes.bool
};

const displayPlainObject = (plainObj) => {
  if (plainObj) {
    return JSON.stringify(plainObj, null, '  '); //beauty it
  }
  return '';
};

const DisplayFileList = (props) => {
  const ary = props.ary || [];
  const isModified = props.isModified;
  return (<dl style={{display:ary.length===0 ? 'none' : ''}}>
    <dt>{props.title}:</dt>
    <dd>
      <ul style={{overflow:'auto', width:'99%', 'maxHeight': '400px'}}>
        {ary.map((val, k)=>{
          val = val.split('/').slice(-1)[0];
          if (isModified) {
            return (<li style={{cursor:'pointer'}} onClick={props.isModifiedOnClick[k]} key={k}><a style={{display:'block'}}>{val}</a></li>);
          }
          return (<li key={k}>{val}</li>);
        })}
      </ul>
    </dd>
  </dl>);
};
DisplayFileList.propTypes = {
  title: PropTypes.string,
  isModified: PropTypes.bool,
  isModifiedOnClick: PropTypes.array, // [func, func, func....]
  ary: PropTypes.array
};

class AxapiAutomationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {reqBodyValue:undefined, resBodyValue:undefined,
      connectHost: '',
      connectUser: '',
      connectPwd: ''
    };
  };
  componentDidMount() {
    const {
      location: { query }
    } = this.context;
    if (query.tab==='TAB___API') { // for /main/axapi-automation?apiPage=3&curProduct=4_1_1&tab=TAB___API
      this.props.changeTabPage('TAB___API', query.curProduct || '4_1_1', undefined, {
              curAPIResultCreatedTime: query.curAPIResultCreatedTime || '1466053870000', 
              apiPage: query.apiPage || '1'
            });
    } else {
      console.log('------query', query);
      // for TAB___CLI TAB___JSON
      // for /main/axapi-automation?build=140&curProduct=4_1_1&tab=TAB___CLI
      // for /main/axapi-automation?build=140&curProduct=4_1_1&tab=TAB___JSON
      if (query.tab && query.curProduct && query.build) {
        this.props.changeTabPage(query.tab, 
                query.curProduct, 
                query.build);
      } else {
        this.props.fetchProduct();
      }
    }
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.curProduct!==nextProps.curProduct) {
      this.props.fetchBuildNumber(nextProps.curProduct);
    }
   if (this.props.aryBuildNumber!==nextProps.aryBuildNumber
    && nextProps.aryBuildNumber
    && nextProps.aryBuildNumber.length) { // EX: changed product dropdownlist
      this.props.changeBuildNumber(nextProps.curProduct,
        this.context.location.query.build || nextProps.aryBuildNumber[0].value,
        nextProps.currentTabPage);
    }
  };

  render() {
    const {
      currentTabPage,
      curProduct,
      aryProduct,
      curBuildNumber,
      aryBuildNumber,
      aryDelFiles,
      aryModFiles,
      aryNewFiles,
      curModifiedDiff,
      //API request
      aryAPIData,
      curAPIResultCreatedTime,
      curAPIPage,
      curAPITotal,
      //actions
      changeTabPage,
      changeBuildNumber,
      changeProduct,
      curModifiedFilename,
      changeModifiedFileName,
    } = this.props;
    const {
      reqBodyValue,
      resBodyValue,
      connectHost,
      connectUser,
      connectPwd
    } = this.state;
    
    console.info(aryAPIData,curAPIResultCreatedTime,curAPIPage,curAPITotal);
    
    const IS_TAB_API = currentTabPage==='TAB___API';
    const IS_TAB_CLI = currentTabPage==='TAB___CLI';
    const IS_TAG_JSON = currentTabPage==='TAB___JSON';
    const tabCLIProps = IS_TAB_CLI ? {secondary: true} : {};
    const tabJSONProps = IS_TAG_JSON ? {secondary: true} : {};
    const tabAPIProps = IS_TAB_API ? {secondary: true} : {};
    const IS_SHOW_BUILD_NUMBER = !IS_TAB_API;
    const IS_SHOW_CONNECT_AREA = IS_TAB_API;

    const hasModifiedFiles = aryModFiles && aryModFiles.length;

    let rightBody;
    if (currentTabPage==='TAB___API') {
      rightBody = (<div>
          <Pagination onChange={(selected)=>{
            const _page = selected;
            changeTabPage('TAB___API', curProduct, undefined, {
              curAPIResultCreatedTime, 
              apiPage: _page
            });
          }} pageSize={API_DATA_PAGESIZE} current={curAPIPage} total={curAPITotal} showQuickJump={true} />
          {aryAPIData.map((item,key)=>{
            return (<div className="automation-page-right__body-row--axapireq" key={key}>
            <div className="automation-page-right__body-row__head">
              <span style={{float:'left', background:'#ffc', color:'#000',borderRadius:'50%',margin: '-2px 8px 0 0'}}>{(curAPIPage-1)*API_DATA_PAGESIZE + key+1}{'.'}</span>
              <span style={{display:!item.isSuccess ? '' : 'none',float:'left','borderRadius':'2px',background:'#b00',color:'#fff',padding:'2px 6px'}}>Fail</span>
              <span style={{display:item.isSuccess ? '' : 'none',float:'left','borderRadius':'2px',background:'green',color:'#fff',padding:'2px 6px'}}>Success</span>
              <h5 style={{padding:'0 8px'}}>{item.api}</h5>
            </div>
            <div className="automation-page-right__body-row__body">
              <RaisedButton
                onClick={()=>{
                  // re-testing
                }}  
                secondary={true}
                style={{float:'right',width:'8%'}}
                label={item.meta.request.method}
                labelStyle={{'textTransform': 'none'}} />
              <TextField
                onChange={(evt)=>{
                  const val = evt.target.value;
                  console.log('val', val);
                }}
                value={item.meta.request.url}
                style={{width:'91.9%'}}
                labelStyle={{textAlign:'center'}}
                hintText="password" />
              <table style={{width:'100%'}}>
              <tbody>
                <tr>
                <td>
                  <label style={{display:'block'}}>REQUEST</label>
                  <textarea style={{resize:'none',width:'100%',height:'230px'}} value={typeof reqBodyValue==='undefined' ? displayPlainObject(item.meta.request.body) : reqBodyValue}
                  onChange={(ev)=>{
                    this.setState({reqBodyValue:ev.target.value});
                  }}></textarea>
                </td>
                <td>
                  <label style={{display:'block'}}>RESPONSE</label>
                  <textarea style={{resize:'none',width:'100%',height:'230px'}} value={typeof resBodyValue==='undefined' ? displayPlainObject(item.meta.response.body) : resBodyValue} 
                  onChange={(ev)=>{
                    this.setState({resBodyValue:ev.target.value});
                  }}></textarea>
                </td>
                </tr>
              </tbody>
              </table>
            </div>
          </div>);
          })}
          <Pagination onChange={(selected)=>{
            const _page = selected;
            changeTabPage('TAB___API', curProduct, undefined, {
              curAPIResultCreatedTime, 
              apiPage: _page
            });
          }} pageSize={API_DATA_PAGESIZE} current={curAPIPage} total={curAPITotal} showQuickJump={true} />
          </div>);
    } else {
      rightBody = (<div className="automation-page-right__body-row--schema" style={{minHeight:'800px', 'display':currentTabPage!=='TAB___API' ? '' : 'none'}}>
              <div style={{float: hasModifiedFiles ? 'left' : 'none',
                width: hasModifiedFiles ? '300px' : 'auto'}}>
              <DisplayFileList title="Modified" 
              isModified={true} 
              isModifiedOnClick={aryModFiles.map((val)=>{
                return ()=>{
                  console.log('val',val);
                  changeModifiedFileName(val, curProduct, currentTabPage, curBuildNumber);
                };
              })}
              ary={aryModFiles} />
              <DisplayFileList title="Created" ary={aryNewFiles} />
              <DisplayFileList title="Deleted" ary={aryDelFiles} />
            </div>
            <div style={{margin:'0 0 0 320px',
            'display': hasModifiedFiles ? '' : 'none'}}>
              <div>
                <DiffLabelTag><strong>{curModifiedFilename}</strong></DiffLabelTag>
              </div>
              <div style={{height:'',overflow:'auto'}}>
                <HighlightMarkdown source={_convertDiffContent(curModifiedDiff)}/>
              </div>
              {/*<div style={{display:'', height:'500px', background:'#eee', overflow:'auto', padding:'10px 20px'}}
                dangerouslySetInnerHTML={{__html:colorfulDiff(curModifiedDiff)}}
              >
              </div>*/}
            </div>
            <div style={{clear:'both'}}></div>
            <RaisedButton
                onClick={()=>{
                  const whatSchemaChange = IS_TAG_JSON ? 'JOSN-Schema' : 'CLI-Schema';
                  const tags = [whatSchemaChange.toLowerCase(),
                        'schema-changes' //,
                        // curProduct + '-build' + curBuildNumber
                        ].join(',');
                  const title = `${whatSchemaChange} - ${curModifiedFilename} changes on ${curProduct}-build${curBuildNumber}`;
                  location.href = `/main/knowledge/document/edit/new?title=${title}&tags=${tags}&document_type=knowledges`;
                }}  
                secondary={true}
                style={{position:'fixed', right:'120px', bottom:'80px', opacity: curModifiedFilename ? '1' : '0', 'transition': 'opacity 1s'}}
                label={`To write article/knowledge for these changes in ${curModifiedFilename}`}
                labelStyle={{'textTransform': 'none'}} />
          </div>);
    }

    return (<section className="automation-page">
      <div className="automation-page-left">
        {/*axapi endpoint prefix tree, not page_assignment tree.*/}
      </div>
      <div className="automation-page-right">
        <div className="automation-page-right__head">
          <div style={{float:'right', display:IS_SHOW_CONNECT_AREA ? '' : 'none'}}>
            <TextField
                onChange={(evt)=>{
                  const val = evt.target.value;
                  console.log('val', val);
                  this.setState({connectHost:val});
                }}
                value={connectHost}
                style={{width:'130px'}}
                hintText="192.168.105.72" />
            <TextField
                onChange={(evt)=>{
                  const val = evt.target.value;
                  console.log('val', val);
                  this.setState({connectUser:val});
                }}
                value={connectUser}
                style={{width:'100px'}}
                hintText="username" />
            <TextField
                onChange={(evt)=>{
                  const val = evt.target.value;
                  console.log('val', val);
                  this.setState({connectPwd:val});
                }}
                value={connectPwd}
                style={{width:'100px'}}
                hintText="password" />
            <RaisedButton
              onClick={()=>{
                console.log(connectHost, connectPwd, connectUser);
              }}  
              label="Connnect"
              labelStyle={{'textTransform': 'none'}} />
          </div>
          <RaisedButton {...tabCLIProps} label="CLI Schema Changes" labelStyle={{'textTransform': 'none'}} onClick={()=>{
            changeTabPage('TAB___CLI', curProduct, curBuildNumber);
          }} />
          <RaisedButton {...tabJSONProps} label="JSON Schema Changes" labelStyle={{'textTransform': 'none'}} onClick={()=>{
            changeTabPage('TAB___JSON', curProduct, curBuildNumber);
          }} />
          <RaisedButton {...tabAPIProps} label="API Request" labelStyle={{'textTransform': 'none'}} onClick={()=>{
            console.log('TAB___API', curProduct, curAPIResultCreatedTime);
            changeTabPage('TAB___API', curProduct, undefined, {
                  curAPIResultCreatedTime, 
                  apiPage: 1
                });
          }} />
          <div>
            <label>Product:&nbsp;</label>
            <DropDownList
                isNeedAll={false}
                title={curProduct}
                onOptionClick={(val)=>{
                  changeProduct(val); //val is product
                }}
                aryOptionConfig={aryProduct}
            />
            <span style={{display:IS_SHOW_BUILD_NUMBER ? '' : 'none'}}>
            <label>Build number:&nbsp;</label>
            <DropDownList
                isNeedAll={false}
                title={curBuildNumber}
                onOptionClick={(val)=>{
                  changeBuildNumber(curProduct, val, currentTabPage); //val is build
                }}
                aryOptionConfig={aryBuildNumber}
            />
            </span>
            <hr />
          </div>
        </div>
        <div className="automation-page-right__body">
          {/* useless code [1].map(()=>{
            return (<div className="automation-page-right__body-row--schema">
            <div className="automation-page-right__body-row--schema__right" style={{'margin':'0 0 10px', width:'64%'}}>
              <div>
                <DiffLabelTag>Server</DiffLabelTag>
                <DiffLabelTag>ServerGroup</DiffLabelTag>
              </div>
              <div style={{height:'500px', background:'#ddd'}}></div>
            </div>
          </div>);
          })*/}
          {rightBody}
        </div>{/*automation-page-right__body*/}
        {/*<div className="automation-page-right__foot">
          pagination here
        </div>*/}
      </div>
    </section>);
  }
}

AxapiAutomationPage.contextTypes = {
    location: PropTypes.object,
    history: PropTypes.object
};
AxapiAutomationPage.propTypes = {
  currentTabPage: PropTypes.string,
  curProduct: PropTypes.string,
  aryProduct: PropTypes.array,
  curBuildNumber: PropTypes.string,
  aryBuildNumber: PropTypes.array,

  aryDelFiles: PropTypes.array,
  aryModFiles: PropTypes.array,
  aryNewFiles: PropTypes.array,
  curModifiedFilename: PropTypes.string,
  curModifiedDiff: PropTypes.string,

  aryAPIData: PropTypes.array,
  curAPIResultCreatedTime: PropTypes.number,
  curAPIPage: PropTypes.number,
  curAPITotal: PropTypes.number,

  fetchProduct: PropTypes.func,
  fetchBuildNumber: PropTypes.func,
  
  changeTabPage: PropTypes.func,
  changeProduct: PropTypes.func,
  changeBuildNumber: PropTypes.func,
  changeModifiedFileName: PropTypes.func,
};
AxapiAutomationPage.defaultProps = {
  curProduct: '',
  curBuildNumber: '',
  curAPIResultCreatedTime: 1466053870000
};


function mapStateToProps(state) {
    return Object.assign(
        {},
        state.axapiAutomation.toJS(),
        state.app.toJS()
    );
}

function mapDispatchToProps(dispatch) {
    return Object.assign(
        {},
        bindActionCreators(AxapiAutomationPageActions, dispatch)
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AxapiAutomationPage);
