import React, { Component } from 'react';

import {
  InputValidPropTypes, InputValidDefaultProps,
  isIPv6, isIPv4, REGEXP_EMAIL
} from './Base'; 
import InputValid from './Input-Valid'; 

export default class InputValidEmail extends Component {
  constructor(props) {
    super(props);
    this.hint = `Email Address`;
    this.err = `Please input correct email address`;
  }
  getIsValid(val) {
    return isIPv4(val) || isIPv6(val) || REGEXP_EMAIL.test(val);
  }
  render() {
    return (<InputValid {...this.props}  
        getIsValid={this.getIsValid.bind(this)} 
        validType="InputValidEmail" 
        hint={this.hint} 
        err={this.err} 
      />);
  }
};
InputValidEmail.propTypes = Object.assign({}, InputValidPropTypes);
InputValidEmail.defaultProps = Object.assign({}, InputValidDefaultProps);
