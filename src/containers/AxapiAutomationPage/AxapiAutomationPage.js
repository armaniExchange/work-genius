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
  componentDidMount() {
    //fetch aryProduct
    //fetch aryBuildNumber
    const {
      fetchProduct
    } = this.props;
    fetchProduct();
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.curProduct!==nextProps.curProduct) {
      this.props.fetchBuildNumber(nextProps.curProduct);
    }
   if (this.props.aryBuildNumber!==nextProps.aryBuildNumber
    && nextProps.aryBuildNumber
    && nextProps.aryBuildNumber.length) { // EX: changed product dropdownlist
      this.props.changeBuildNumber(nextProps.curProduct,
        nextProps.aryBuildNumber[0].value,
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
      curAPIPage,
      curAPITotal,
      //actions
      changeTabPage,
      changeBuildNumber,
      changeProduct,
      curModifiedFilename,
      changeModifiedFileName,
    } = this.props;


    const tabCLIProps = currentTabPage==='TAB___CLI' ? {secondary: true} : {};
    const tabJSONProps = currentTabPage==='TAB___JSON' ? {secondary: true} : {};
    const tabAPIProps = currentTabPage==='TAB___API' ? {secondary: true} : {};

    const hasModifiedFiles = aryModFiles && aryModFiles.length;

    let rightBody;
    if (currentTabPage==='TAB___API') {
      rightBody = (<div>
          {[1,2,3].map((_,key)=>{
            return (<div className="automation-page-right__body-row--axapireq" key={key}>
            <div className="automation-page-right__body-row__head">
              <span style={{float:'left','borderRadius':'2px',background:'#b00',color:'#fff',padding:'2px 6px'}}>Fail</span>
              <span style={{float:'left','borderRadius':'2px',background:'green',color:'#fff',padding:'2px 6px'}}>Success</span>
              <h5 style={{padding:'0 8px'}}>_cases_path_...<span>cases_name.py</span></h5>
            </div>
            <div className="automation-page-right__body-row__body">
              <RaisedButton
                onClick={()=>{
                }}  
                secondary={true}
                style={{float:'right',width:'8%'}}
                label="_method_"
                labelStyle={{'textTransform': 'none'}} />
              <TextField
                onChange={(evt)=>{
                  const val = evt.target.value;
                  console.log('val', val);
                }}
                value="/axapi/v3/object-group/network/"
                style={{width:'91.9%'}}
                labelStyle={{textAlign:'center'}}
                hintText="password" />
              <table style={{width:'100%'}}>
              <tbody>
                <tr>
                <td>
                  <label style={{display:'block'}}>REQUEST</label>
                  <textarea style={{resize:'none',width:'100%',height:'230px'}} defaultValue={"_request_"}></textarea>
                </td>
                <td>
                  <label style={{display:'block'}}>RESPONSE</label>
                  <textarea style={{resize:'none',width:'100%',height:'230px'}} defaultValue={"_response_"}></textarea>
                </td>
                </tr>
              </tbody>
              </table>
              <Pagination onChange={(selected)=>{
                alert(selected);
              }} pageSize={12} current={curAPIPage} total={curAPITotal} />
            </div>
          </div>);
          })}
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
          </div>);
    }

    return (<section className="automation-page">
      <div className="automation-page-left">
        {/*axapi endpoint prefix tree, not page_assignment tree.*/}
      </div>
      <div className="automation-page-right">
        <div className="automation-page-right__head">
          <div style={{float:'right'}}>
            <TextField
                onChange={(evt)=>{
                  const val = evt.target.value;
                  console.log('val', val);
                }}
                style={{width:'130px'}}
                hintText="192.168.105.72" />
            <TextField
                onChange={(evt)=>{
                  const val = evt.target.value;
                  console.log('val', val);
                }}
                style={{width:'100px'}}
                hintText="username" />
            <TextField
                onChange={(evt)=>{
                  const val = evt.target.value;
                  console.log('val', val);
                }}
                style={{width:'100px'}}
                hintText="password" />
            <RaisedButton
              onClick={()=>{
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
            console.log('TAB___API', curProduct, curBuildNumber);
            changeTabPage('TAB___API', curProduct, curBuildNumber);
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
            <label>Build number:&nbsp;</label>
            <DropDownList
                isNeedAll={false}
                title={curBuildNumber}
                onOptionClick={(val)=>{
                  changeBuildNumber(curProduct, val, currentTabPage); //val is build
                }}
                aryOptionConfig={aryBuildNumber}
            />
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
  curBuildNumber: ''
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
