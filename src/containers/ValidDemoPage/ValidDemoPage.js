// Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { InputValidNumber, InputValidCharacter } from '../../components/A10-UI/Valid/';

class ValidDemoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pkvalue1:'kk', pkvalue2:'kk@', pkvalue3:'yy#yy', pkvalue4:'zz/zz',
      character1:'kk', character2:'kk@', character3:'yyyy', character4:'zzzz',
      num1:'kk', num2:1, num3:2, num4:'10'
    };
  }
  render() {
    return (<section>
      <h1>Valid Demo Page</h1>
      <InputValidNumber defaultValue={this.state.num1} />
      <InputValidNumber min={3} max={9} defaultValue={this.state.num2} />
      <InputValidNumber min={3} defaultValue={this.state.num3} />
      <InputValidNumber max={9} defaultValue={this.state.num4} />
      <InputValidNumber max={9} defaultValue={this.state.num4} />
      <hr />
      <InputValidCharacter defaultValue={this.state.character1} />
      <InputValidCharacter min={3} max={9} defaultValue={this.state.character2} />
      <InputValidCharacter min={3} defaultValue={this.state.character3} />
      <InputValidCharacter max={9} defaultValue={this.state.character4} />
      <InputValidCharacter max={9} defaultValue={this.state.character4} />
      <hr />
      {/*
      <InputValidPrimarykey defaultValue={this.state.pkvalue1} />
      <InputValidPrimarykey min={3} max={9} defaultValue={this.state.pkvalue2} />
      <InputValidPrimarykey min={3} defaultValue={this.state.pkvalue3} />
      <InputValidPrimarykey max={9} defaultValue={this.state.pkvalue4} />
      <InputValidPrimarykey max={9} defaultValue={this.state.pkvalue4} />
      */}
    </section>
    );
  }
}

export default connect()(ValidDemoPage);
