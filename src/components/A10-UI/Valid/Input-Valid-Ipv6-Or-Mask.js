import React, { Component } from 'react';

import {
  InputValidPropTypes, InputValidDefaultProps,
  isIPv6, IPV6_SUBNET_MAX_PREFIX, SUBNET_MIN_PREFIX
} from './Base'; 
import InputValid from './Input-Valid'; 

export default class InputValidIpv6OrMask extends Component {
  constructor(props) {
    super(props);
    this.hint = 'IPv6 or IPv6/Mask';
    this.err = 'Please input correct IPv6 or IPv6/Mask information';
  }
  getIsValid(val) {
    let isValid = false;
    if (val && (val+'').indexOf('/') > 1) {
      let ary = val.split('/');
      if (isIPv6(ary[0])) {
        if (!isNaN(ary[1]) && (ary[1] >= SUBNET_MIN_PREFIX && ary[1]<= IPV6_SUBNET_MAX_PREFIX)) {
          isValid = true;
        }
      }
    } else {
      if (isIPv6(val)) {
        isValid = true;
      }
    }
    return isValid;
  }
  render() {
    return (<InputValid {...this.props}  
        getIsValid={this.getIsValid.bind(this)} 
        validType="InputValidIpv6OrMask" 
        hint={this.hint} 
        err={this.err} 
      />);
  }
};
InputValidIpv6OrMask.propTypes = Object.assign({}, InputValidPropTypes);
InputValidIpv6OrMask.defaultProps = Object.assign({}, InputValidDefaultProps);
