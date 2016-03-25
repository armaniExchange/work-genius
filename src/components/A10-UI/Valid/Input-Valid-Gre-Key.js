import React, { Component } from 'react';

import {
  InputValidPropTypes, InputValidDefaultProps,
  MIN_GRE_KEY_LENGTH, MAX_GRE_KEY_LENGTH
} from './Base'; 
import InputValid from './Input-Valid'; 

export default class InputValidGreKey extends Component {
  constructor(props) {
    super(props);
    let minlen = MIN_GRE_KEY_LENGTH,
        maxlen = MAX_GRE_KEY_LENGTH;
    
    this.hint = `${minlen}-${maxlen} hexadecimal numbers`;
    this.err = `GRE Key should be "${minlen}-${maxlen} hexadecimal numbers`;

    this.REGEXP_GRE_KEY = RegExp('^[0-9a-fA-F]{'+minlen+','+maxlen+'}$');
  }
  getIsValid(val) {
    return this.REGEXP_GRE_KEY.test( val );
  }
  render() {
    return (<InputValid {...this.props}  
        getIsValid={this.getIsValid.bind(this)} 
        validType="InputValidGreKey" 
        hint={this.hint} 
        err={this.err} 
      />);
  }
};
InputValidGreKey.propTypes = Object.assign({}, InputValidPropTypes);
InputValidGreKey.defaultProps = Object.assign({}, InputValidDefaultProps);
