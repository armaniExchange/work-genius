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
  InputValidIpv4Mask,
  InputValidIpv6Mask,
  InputValidIp,
  InputValidPort,
  InputValidIpWithMask,
  InputValidIpv4OrMask,
  InputValidIpv6OrMask
} from '../../components/A10-UI/Valid/';

let DemoBox = ({title, children}) => {
  return (<dl style={{margin:'0 0 10px', display: 'inline-block', width:'32%', margin:'0 0 20px'}}>
      <dt style={{padding:'3px 12px',borderRadius:'5px',background:'#ddd'}}>{title}</dt>
      <dd style={{padding:'0 0 0 20px'}}>{children}</dd>
    </dl>);
};
let DemoBoxDesc = ({children, style}) => {
  return (<div style={Object.assign({}, {
      background:'#ffc',
      padding:'3px 9px'
    }, style)}>{children}</div>);
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
      <div style={{display:'flex', flexDirection:'column', flexWrap:'wrap', columnCount:3, columnGap: 0, height:'1500px', background:'#efefef'}}>
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
      <DemoBox title="InputValidIp">
        <InputValidIp defaultValue="2.4.5.7" />
        <InputValidIp defaultValue="1000::ffff" />
        <InputValidIp defaultValue="0.0.0.0" ipv4only={true} />
        <InputValidIp defaultValue="0.0.0.0" ipv4only={true} ipno0={true} />
        <InputValidIp defaultValue="1000::eeee" ipv6only={true} />
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
      <DemoBox title="InputValidIpv6Mask">
        <DemoBoxDesc>/0 ~ /128</DemoBoxDesc>
        <InputValidIpv6Mask defaultValue="/128" />
      </DemoBox>
      <DemoBox title="InputValidPort">
        <InputValidPort defaultValue="3-6" />
        <InputValidPort defaultValue="7-6" />
        <InputValidPort defaultValue="7" />
        <InputValidPort defaultValue="other" allowOther={true} />
        <InputValidPort defaultValue={65535} />
        <InputValidPort defaultValue={65535} allow65535={false} />
      </DemoBox>
      <DemoBox title="InputValidIpWithMask">
        <DemoBoxDesc>MUST be "IPvalue/prefix"</DemoBoxDesc>
        <InputValidIpWithMask defaultValue="1000::eeee/128" />
        <InputValidIpWithMask defaultValue="1000::eeee/129" />
        <InputValidIpWithMask defaultValue="1000::eeee" />
        <InputValidIpWithMask defaultValue="3.6.7.2/32" />
        <InputValidIpWithMask defaultValue="3.6.7.2/33" />
        <InputValidIpWithMask defaultValue="/33" />
        <DemoBoxDesc style={{margin:'30px 0 0'}}>ipv4only</DemoBoxDesc>
        <InputValidIpWithMask ipv4only={true} defaultValue="1000::eeee/128" />
        <InputValidIpWithMask ipv4only={true} defaultValue="1000::eeee/129" />
        <InputValidIpWithMask ipv4only={true} defaultValue="1000::eeee" />
        <InputValidIpWithMask ipv4only={true} defaultValue="3.6.7.2/32" />
        <InputValidIpWithMask ipv4only={true} defaultValue="3.6.7.2/33" />
        <InputValidIpWithMask ipv4only={true} defaultValue="/33" />
        <DemoBoxDesc style={{margin:'30px 0 0'}}>ipv6only</DemoBoxDesc>
        <InputValidIpWithMask ipv6only={true} defaultValue="1000::eeee/128" />
        <InputValidIpWithMask ipv6only={true} defaultValue="1000::eeee/129" />
        <InputValidIpWithMask ipv6only={true} defaultValue="1000::eeee" />
        <InputValidIpWithMask ipv6only={true} defaultValue="3.6.7.2/32" />
        <InputValidIpWithMask ipv6only={true} defaultValue="3.6.7.2/33" />
        <InputValidIpWithMask ipv6only={true} defaultValue="/33" />
      </DemoBox>
      <DemoBox title="InputValidIpv4OrMask">
        <InputValidIpv4OrMask />
      </DemoBox>
      <DemoBox title="InputValidIpv6OrMask">
        <InputValidIpv6OrMask />
      </DemoBox>
      <DemoBox title="InputValidIpv4oripv6orhost" showContent={this.state.showAllDemoBoxContent}>
        <InputValidIpv4oripv6orhost />
      </DemoBox>
      </div>
    </section>
    );
  }
}

export default connect()(ValidDemoPage);
