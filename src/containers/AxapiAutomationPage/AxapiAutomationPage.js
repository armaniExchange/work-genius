// Style
import './_AxapiAutomationPage.css';
// React & Redux
// import React, { Component, PropTypes } from 'react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import { bindActionCreators } from 'redux';
// Actions
import * as AxapiAutomationPageActions from '../../actions/search-actions';


class AxapiAutomationPage extends Component {
  render() {
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
          <RaisedButton label="API Request" labelStyle={{'textTransform': 'none'}} />
          <RaisedButton label="Schema Changes" labelStyle={{'textTransform': 'none'}} />
        </div>
        <div className="automation-page-right__body">
          {[1,2,3].map(()=>{
            return (<div className="automation-page-right__body-row">
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
};
AxapiAutomationPage.defaultProps = {
};


function mapStateToProps(state) {
    return Object.assign(
        {},
        state.search.toJS(),
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
