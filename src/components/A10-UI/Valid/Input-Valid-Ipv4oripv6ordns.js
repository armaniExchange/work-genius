import React, { Component } from 'react';

import {
  InputValidPropTypes, InputValidDefaultProps,
  isIPv6, isIPv4, isDNSAscii
} from './Base'; 
import InputValid from './Input-Valid'; 

export default class InputValidIpv4oripv6ordns extends Component {
  constructor(props) {
    super(props);
    this.hint = `IPv4/IPv6/DNS`;
    this.err = `Please input correct IPv4/IPv6/DNS`;
  }
  getIsValid(val) {
    return isIPv4(val) || isIPv6(val) || isDNSAscii(val);
  }
  render() {
    return (<InputValid {...this.props}
        getIsValid={this.getIsValid.bind(this)} 
        validType="InputValidIpv4oripv6ordns" 
        hint={this.hint} 
        err={this.err} 
      />);
  }
};
InputValidIpv4oripv6ordns.propTypes = Object.assign({}, InputValidPropTypes);
InputValidIpv4oripv6ordns.defaultProps = Object.assign({}, InputValidDefaultProps);
