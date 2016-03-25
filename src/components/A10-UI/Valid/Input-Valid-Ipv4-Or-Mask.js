import React, { Component } from 'react';

import {
  InputValidPropTypes, InputValidDefaultProps,
  isIPv4, IPV4_SUBNET_MAX_PREFIX, SUBNET_MIN_PREFIX
} from './Base'; 
import InputValid from './Input-Valid'; 

export default class InputValidIpv4OrMask extends Component {
  constructor(props) {
    super(props);
    this.hint = 'IPv4 or IPv4/Mask';
    this.err = 'Please input correct IPv4 or IPv4/Mask information';
  }
  getIsValid(val) {
    let isValid = false;
    if (val && (val+'').indexOf('/') > 1) {
      let ary = val.split('/');
      if (isIPv4(ary[0])) {
        if (!isNaN(ary[1]) && (ary[1] >= SUBNET_MIN_PREFIX && ary[1]<= IPV4_SUBNET_MAX_PREFIX)) {
          isValid = true;
        }
      }
    } else {
      if (isIPv4(val)) {
        isValid = true;
      }
    }
    return isValid;
  }
  render() {
    return (<InputValid {...this.props}  
        getIsValid={this.getIsValid.bind(this)} 
        validType="InputValidIpv4OrMask" 
        hint={this.hint} 
        err={this.err} 
      />);
  }
};
InputValidIpv4OrMask.propTypes = Object.assign({}, InputValidPropTypes);
InputValidIpv4OrMask.defaultProps = Object.assign({}, InputValidDefaultProps);
