// Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { 
  InputValidNumber, 
  InputValidCharacter, 
  InputValidPrimarykey, 
  InputValidGreKey,
  InputValidHexKey,
  InputValidMac,
  InputValidIpv4Mask
} from '../../components/A10-UI/Valid/';

let DemoBox = ({title, children}) => {
  return (<dl style={{margin:'0 0 10px', display: 'inline-block', width:'32%', margin:'0 0 20px'}}>
      <dt style={{padding:'3px 12px',borderRadius:'5px',background:'#ddd'}}>{title}</dt>
      <dd style={{padding:'0 0 0 20px'}}>{children}</dd>
    </dl>);
};
let DemoBoxDesc = ({children}) => {
  return (<div style={{background:'#ccc',padding:'3px 9px'}}>{children}</div>);
};

class ValidDemoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pkvalue1:'kk', pkvalue2:'kk@', pkvalue3:'yy#yy', pkvalue4:'zz/zz',
      character1:'kk', character2:'kk@', character3:'yyyy', character4:'9999',
      num1:'kk', num2:1, num3:2, num4:'10'
    };
  }
  render() {
    return (<section>
      <h4 style={{margin:0,padding:0}}>Valid Demo Page</h4>
      <div style={{display:'flex', flexDirection:'column', flexWrap:'wrap', columnCount:3, columnGap: 0, height:'', background:'#efefef'}}>
      <DemoBox title="InputValidNumber">
        <InputValidNumber defaultValue={this.state.num1} />
        <InputValidNumber min={3} max={9} defaultValue={this.state.num2} />
        <InputValidNumber min={3} defaultValue={this.state.num3} />
        <InputValidNumber max={9} defaultValue={this.state.num4} />
        <InputValidNumber max={9} defaultValue={this.state.num4} />
      </DemoBox>
      <DemoBox title="InputValidCharacter">
        <InputValidCharacter defaultValue={this.state.character1} />
        <InputValidCharacter min={3} max={9} characterType="onlyLetterNumberSp" defaultValue={this.state.character2} />
        <InputValidCharacter min={3} defaultValue={this.state.character3} />
        <InputValidCharacter max={9} defaultValue={this.state.character4} />
        <InputValidCharacter max={9} characterType="onlyLetterSp" defaultValue={this.state.character4} />
      </DemoBox>
      <DemoBox title="InputValidPrimarykey">
      <InputValidPrimarykey defaultValue={this.state.pkvalue1} />
      <InputValidPrimarykey min={3} max={9} defaultValue={this.state.pkvalue2} />
      <InputValidPrimarykey min={3} defaultValue={this.state.pkvalue3} />
      <InputValidPrimarykey max={9} defaultValue={this.state.pkvalue4} />
      <InputValidPrimarykey max={9} defaultValue={this.state.pkvalue4} />
      </DemoBox>
      <DemoBox title="InputValidGreKey">
        <InputValidGreKey defaultValue="xyz" />
        <InputValidGreKey defaultValue="abc" />
        <InputValidGreKey defaultValue="abcdabcdabcd" />
      </DemoBox>
      <DemoBox title="InputValidHexKey">
        <InputValidHexKey defaultValue="abcdabcdabcdABCDABCDXY" />
        <InputValidHexKey defaultValue="abcdabcdabcdABCDABCD99" />
        <InputValidHexKey inputType="password" doNotCareValuesForDisplayingPassword={['^!key%show$^!key%show$^']} defaultValue="^!key%show$^!key%show$^" />
        <InputValidHexKey defaultValue="abc5bc" min={3} max={6} />
      </DemoBox>
      <DemoBox title="InputValidMac">
        <DemoBoxDesc>
        valid = Try 3D:F2:C9:A6:B3:4F ...or... 3D:F2:C9:A6:B3:4f)<br />
        invalid = Try 0017:f297:af99
        </DemoBoxDesc>
        <InputValidMac defaultValue="0017:f297:af99" />
        <InputValidMac defaultValue="3D:F2:C9:A6:B3:4f" />
      </DemoBox>
      <DemoBox title="InputValidIpv4Mask">
        <DemoBoxDesc>
        valid = Try 255.255.128.0 255.255.255.0 255.255.0.0 /0~/32<br />
        invalid = Try 255.255.128.1
        </DemoBoxDesc>
        <InputValidIpv4Mask defaultValue="255.255.128.0" />
        <InputValidIpv4Mask defaultValue="255.255.128.0" slashmaskonly={true} />
        <InputValidIpv4Mask defaultValue="255.255.128.0" ipaddronly={true} />
      </DemoBox>
      </div>
    </section>
    );
  }
}

export default connect()(ValidDemoPage);
