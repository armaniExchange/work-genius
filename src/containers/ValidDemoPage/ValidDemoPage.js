// Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ValidNumber, ValidCharacter } from '../../components/A10-UI/Valid/';

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
      <ValidNumber defaultValue={this.state.num1} />
      <ValidNumber min={3} max={9} defaultValue={this.state.num2} />
      <ValidNumber min={3} defaultValue={this.state.num3} />
      <ValidNumber max={9} defaultValue={this.state.num4} />
      <ValidNumber max={9} defaultValue={this.state.num4} />
      <hr />
      <ValidCharacter defaultValue={this.state.character1} />
      <ValidCharacter min={3} max={9} defaultValue={this.state.character2} />
      <ValidCharacter min={3} defaultValue={this.state.character3} />
      <ValidCharacter max={9} defaultValue={this.state.character4} />
      <ValidCharacter max={9} defaultValue={this.state.character4} />
      <hr />
      {/*
      <ValidPrimarykey defaultValue={this.state.pkvalue1} />
      <ValidPrimarykey min={3} max={9} defaultValue={this.state.pkvalue2} />
      <ValidPrimarykey min={3} defaultValue={this.state.pkvalue3} />
      <ValidPrimarykey max={9} defaultValue={this.state.pkvalue4} />
      <ValidPrimarykey max={9} defaultValue={this.state.pkvalue4} />
      */}
    </section>
    );
  }
}

export default connect()(ValidDemoPage);
