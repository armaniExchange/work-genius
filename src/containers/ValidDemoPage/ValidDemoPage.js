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
  InputValidIpv6OrMask,
  InputValidIpv4oripv6orhost,
  InputValidIpv4oripv6ordns,
  InputValidEmail,
  InputValidFilepath,
  InputValidTime,
  InputValidDate,
} from '../../components/A10-UI/Valid/';

let DemoBox = ({title, children, showContent}) => {
  return (<dl style={{margin:'0 0 20px'}}>
      <dt style={{padding:'3px 12px',borderRadius:'5px',background:'#ddd'}}>{title}</dt>
      <dd style={{padding:'0 0 0 20px', display: showContent ? '' : 'none'}}>{children}</dd>
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
      showAllDemoBoxContent: true,
      pkvalue1:'kk', pkvalue2:'kk@', pkvalue3:'yy#yy', pkvalue4:'zz/zz',
      character1:'kk', character2:'kk@', character3:'yyyy', character4:'9999',
      num1:'kk', num2:1, num3:2, num4:'10'
    };
  }
  render() {
    return (<section>
      <h4 style={{margin:0,padding:0}}>Valid Demo Page</h4>
      <label style={{color:'#EF23FA'}}><input type="checkbox" defaultChecked={this.state.showAllDemoBoxContent} onChange={()=>{
        this.setState({'showAllDemoBoxContent': !this.state.showAllDemoBoxContent});
      }} />Show/Hide all box content</label>
      <div style={{background:'#efefef'}}>
      <DemoBox title="InputValidNumber" showContent={this.state.showAllDemoBoxContent}>
        <InputValidNumber defaultValue={this.state.num1} />
        <InputValidNumber min={3} max={9} defaultValue={this.state.num2} />
        <InputValidNumber min={3} defaultValue={this.state.num3} />
        <InputValidNumber max={9} defaultValue={this.state.num4} />
        <InputValidNumber max={9} defaultValue={this.state.num4} />
      </DemoBox>
      <DemoBox title="InputValidCharacter" showContent={this.state.showAllDemoBoxContent}>
        <InputValidCharacter defaultValue={this.state.character1} />
        <InputValidCharacter min={3} max={9} characterType="onlyLetterNumberSp" defaultValue={this.state.character2} />
        <InputValidCharacter min={3} defaultValue={this.state.character3} />
        <InputValidCharacter max={9} defaultValue={this.state.character4} />
        <InputValidCharacter max={9} characterType="onlyLetterSp" defaultValue={this.state.character4} />
      </DemoBox>
      <DemoBox title="InputValidPrimarykey" showContent={this.state.showAllDemoBoxContent}>
      <InputValidPrimarykey defaultValue={this.state.pkvalue1} />
      <InputValidPrimarykey min={3} max={9} defaultValue={this.state.pkvalue2} />
      <InputValidPrimarykey min={3} defaultValue={this.state.pkvalue3} />
      <InputValidPrimarykey max={9} defaultValue={this.state.pkvalue4} />
      <InputValidPrimarykey max={9} defaultValue={this.state.pkvalue4} />
      </DemoBox>
      <DemoBox title="InputValidGreKey" showContent={this.state.showAllDemoBoxContent}>
        <InputValidGreKey defaultValue="xyz" />
        <InputValidGreKey defaultValue="abc" />
        <InputValidGreKey defaultValue="abcdabcdabcd" />
      </DemoBox>
      <DemoBox title="InputValidHexKey" showContent={this.state.showAllDemoBoxContent}>
        <InputValidHexKey defaultValue="abcdabcdabcdABCDABCDXY" />
        <InputValidHexKey defaultValue="abcdabcdabcdABCDABCD99" />
        <InputValidHexKey inputType="password" doNotCareValuesForDisplayingPassword={['^!key%show$^!key%show$^']} defaultValue="^!key%show$^!key%show$^" />
        <InputValidHexKey defaultValue="abc5bc" min={3} max={6} />
      </DemoBox>
      <DemoBox title="InputValidMac" showContent={this.state.showAllDemoBoxContent}>
        <DemoBoxDesc>
        valid = Try 3D:F2:C9:A6:B3:4F ...or... 3D:F2:C9:A6:B3:4f)<br />
        invalid = Try 0017:f297:af99
        </DemoBoxDesc>
        <InputValidMac defaultValue="0017:f297:af99" />
        <InputValidMac defaultValue="3D:F2:C9:A6:B3:4f" />
      </DemoBox>
      <DemoBox title="InputValidIp" showContent={this.state.showAllDemoBoxContent}>
        <InputValidIp defaultValue="2.4.5.7" />
        <InputValidIp defaultValue="1000::ffff" />
        <InputValidIp defaultValue="0.0.0.0" ipv4only={true} />
        <InputValidIp defaultValue="0.0.0.0" ipv4only={true} ipno0={true} />
        <InputValidIp defaultValue="1000::eeee" ipv6only={true} />
      </DemoBox>
      <DemoBox title="InputValidIpv4Mask" showContent={this.state.showAllDemoBoxContent}>
        <DemoBoxDesc>
        valid = Try 255.255.128.0 255.255.255.0 255.255.0.0 /0~/32<br />
        invalid = Try 255.255.128.1
        </DemoBoxDesc>
        <InputValidIpv4Mask defaultValue="255.255.128.0" />
        <InputValidIpv4Mask defaultValue="255.255.128.0" slashmaskonly={true} />
        <InputValidIpv4Mask defaultValue="255.255.128.0" ipaddronly={true} />
      </DemoBox>
      <DemoBox title="InputValidIpv6Mask" showContent={this.state.showAllDemoBoxContent}>
        <DemoBoxDesc>/0 ~ /128</DemoBoxDesc>
        <InputValidIpv6Mask defaultValue="/128" />
      </DemoBox>
      <DemoBox title="InputValidPort" showContent={this.state.showAllDemoBoxContent}>
        <InputValidPort defaultValue="3-6" />
        <InputValidPort defaultValue="7-6" />
        <InputValidPort defaultValue="7" />
        <InputValidPort defaultValue="other" allowOther={true} />
        <InputValidPort defaultValue={65535} />
        <InputValidPort defaultValue={65535} allow65535={false} />
      </DemoBox>
      <DemoBox title="InputValidIpWithMask" showContent={this.state.showAllDemoBoxContent}>
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
      <DemoBox title="InputValidIpv4OrMask" showContent={this.state.showAllDemoBoxContent}>
        <InputValidIpv4OrMask />
      </DemoBox>
      <DemoBox title="InputValidIpv6OrMask" showContent={this.state.showAllDemoBoxContent}>
        <InputValidIpv6OrMask />
      </DemoBox>
      <DemoBox title="InputValidIpv4oripv6orhost" showContent={this.state.showAllDemoBoxContent}>
        <InputValidIpv4oripv6orhost />
      </DemoBox>
      <DemoBox title="InputValidIpv4oripv6ordns" showContent={this.state.showAllDemoBoxContent}>
        <InputValidIpv4oripv6ordns />
      </DemoBox>
      <DemoBox title="InputValidEmail" showContent={this.state.showAllDemoBoxContent}>
        <InputValidEmail />
      </DemoBox>
      <DemoBox title="InputValidFilepath" showContent={this.state.showAllDemoBoxContent}>
        <InputValidFilepath />
      </DemoBox>
      <DemoBox title="InputValidTime" showContent={this.state.showAllDemoBoxContent}>
        <InputValidTime defaultValue="24:00:00" />
        <InputValidTime allow240000={true} defaultValue="24:00:00" />
      </DemoBox>
      <DemoBox title="InputValidDate" showContent={this.state.showAllDemoBoxContent}>
        <InputValidDate defaultValue="2016-03-29" />
        <InputValidDate defaultValue="2016/03/29" dateSpliter="/" />
        <InputValidDate defaultValue="2016-03-29" min="20160330" />
        <InputValidDate defaultValue="2016-03-29" max="20160330" />
        <InputValidDate defaultValue="2016-03-29" max="20160331" min="20160330" />
      </DemoBox>
      </div>
    </section>
    );
  }
}

export default connect()(ValidDemoPage);
