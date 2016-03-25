// Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { 
  InputValidNumber, 
  InputValidCharacter, 
  InputValidPrimarykey, 
  InputValidGreKey,
  InputValidHexKey
} from '../../components/A10-UI/Valid/';

let DemoBox = ({title, children}) => {
  return (<dl style={{margin:'0 0 10px'}}>
      <dt style={{cursor:'pointer',padding:'3px 12px',borderRadius:'5px',background:'#ddd'}}>{title}</dt>
      <dd style={{padding:'0 0 0 50px'}}>{children}</dd>
    </dl>);
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
      <h4>Valid Demo Page</h4>
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
    </section>
    );
  }
}

export default connect()(ValidDemoPage);
