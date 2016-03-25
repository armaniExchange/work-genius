import React, { Component } from 'react';

import {
  InputValidPropTypes, InputValidDefaultProps,
  isIPv6, isIPv4, isValidMask
} from './Base'; 
import InputValid from './Input-Valid'; 

export default class InputValidIpWithMask extends Component {
  constructor(props) {
    super(props);
    
    this.hint = 'IP/Mask';
    this.err = 'Please input correct IP And Mask information';
  }
  getIsValid(val) {
    let isValid = false;
    if (val && val.indexOf('/') > 1) {
      let ary = val.split('/');
      if (isIPv4(ary[0])) {
        isValid = isValidMask(ary[1], 4);
      } else if (isIPv6(ary[0])) {
        isValid = isValidMask(ary[1], 6);
      }
    }
    return isValid;
  }
  render() {
    return (<InputValid {...this.props}  
        getIsValid={this.getIsValid.bind(this)} 
        validType="InputValidIpWithMask" 
        hint={this.hint} 
        err={this.err} 
      />);
  }
};
InputValidIpWithMask.propTypes = Object.assign({}, InputValidPropTypes);
InputValidIpWithMask.defaultProps = Object.assign({}, InputValidDefaultProps);
