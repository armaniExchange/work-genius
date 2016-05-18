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

let DiffLabelTag = (props) => {
  let _style = {padding:'3px 16px', textAlign:'center', color:'#333', background:'#ccc', 'margin': '0 6px 0 0'};
  if (props.emphasize) {
    _style.color = '#fff';
    _style.background = '#b00';
  }
  return <span style={_style}>{props.children}</span>;
};
DiffLabelTag.propTypes = {
  emphasize: PropTypes.bool
};


class AxapiAutomationPage extends Component {
  componentDidMount() {
    //fetch aryProduct
    //fetch aryBuildNumber
    let {
      fetchProduct
    } = this.props;
    fetchProduct();
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.curProduct!==nextProps.curProduct) {
      this.props.fetchBuildNumber(nextProps.curProduct);
    }
  };

  render() {
    let {
      currentTabPage,
      curProduct,
      aryProduct,
      curBuildNumber,
      aryBuildNumber,
      //actions
      changeTabPage,
      changeBuildNumber,
      changeProduct,
    } = this.props;


    let tabCLIProps = currentTabPage==='TAB___CLI' ? {secondary: true} : {};
    let tabJSONProps = currentTabPage==='TAB___JSON' ? {secondary: true} : {};
    let tabAPIProps = currentTabPage==='TAB___API' ? {secondary: true} : {};


    return (<section className="automation-page">
      <div className="automation-page-left">
        {/*axapi endpoint prefix tree, not page_assignment tree.*/}
      </div>
      <div className="automation-page-right">
        <div className="automation-page-right__head">
          <div style={{float:'right'}}>
            <TextField
                onChange={(evt)=>{
                  let val = evt.target.value;
                  console.log('val', val);
                }}
                style={{width:'130px'}}
                hintText="192.168.105.72" />
            <TextField
                onChange={(evt)=>{
                  let val = evt.target.value;
                  console.log('val', val);
                }}
                style={{width:'100px'}}
                hintText="username" />
            <TextField
                onChange={(evt)=>{
                  let val = evt.target.value;
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
            changeTabPage('TAB___CLI');
          }} />
          <RaisedButton {...tabJSONProps} label="JSON Schema Changes" labelStyle={{'textTransform': 'none'}} onClick={()=>{
            changeTabPage('TAB___JSON');
          }} />
          <RaisedButton {...tabAPIProps} label="API Request" labelStyle={{'textTransform': 'none'}} onClick={()=>{
            changeTabPage('TAB___API');
          }} />
          <div>
            <label>Product:&nbsp;</label>
            <DropDownList
                isNeedAll={false}
                title={curProduct}
                onOptionClick={(item)=>{
                  changeProduct(item);
                }}
                aryOptionConfig={aryProduct}
            />
            <label>Build number:&nbsp;</label>
            <DropDownList
                isNeedAll={false}
                title={curBuildNumber}
                onOptionClick={(item)=>{
                  changeBuildNumber(item);
                }}
                aryOptionConfig={aryBuildNumber}
            />
          </div>
        </div>
        <div className="automation-page-right__body">
          {[1,2,3].map(()=>{
            return (<div className="automation-page-right__body-row--schema">
            <div className="automation-page-right__body-row--schema__left" style={{'margin':'0 0 10px', width:'35%'}}>
              <div>
                <DiffLabelTag>CLI</DiffLabelTag>
              </div>
              <div style={{height:'500px', background:'#ddd'}}></div>
            </div>
          </div>);
          })}

          {[1,2,3].map(()=>{
            return (<div className="automation-page-right__body-row--schema">
            <div className="automation-page-right__body-row--schema__right" style={{'margin':'0 0 10px', width:'64%'}}>
              <div>
                <DiffLabelTag>Server</DiffLabelTag>
                <DiffLabelTag>ServerGroup</DiffLabelTag>
              </div>
              <div style={{height:'500px', background:'#ddd'}}></div>
            </div>
          </div>);
          })}

          {[1,2,3].map(()=>{
            return (<div className="automation-page-right__body-row--axapireq">
            <div className="automation-page-right__body-row__head">
              <span style={{float:'left','border-radius':'2px',background:'#b00',color:'#fff',padding:'2px 6px'}}>Fail</span>
              <span style={{float:'left','border-radius':'2px',background:'green',color:'#fff',padding:'2px 6px'}}>Success</span>
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
                  let val = evt.target.value;
                  console.log('val', val);
                }}
                value="/axapi/v3/object-group/network/"
                style={{width:'91.9%'}}
                labelStyle={{textAlign:'center'}}
                hintText="password" />
              <table style={{width:'100%'}}>
                <tr>
                <td>
                  <label style={{display:'block'}}>REQUEST</label>
                  <textarea style={{resize:'none',width:'100%',height:'230px'}}>_request_</textarea>
                </td>
                <td>
                  <label style={{display:'block'}}>RESPONSE</label>
                  <textarea style={{resize:'none',width:'100%',height:'230px'}}>_response_</textarea>
                </td>
                </tr>
              </table>
            </div>
          </div>);
          })}
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

  fetchProduct: PropTypes.func,
  fetchBuildNumber: PropTypes.func,
  
  changeTabPage: PropTypes.func,
  changeProduct: PropTypes.func,
  changeBuildNumber: PropTypes.func
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
