import React, { Component } from 'react';

import {
  InputValidPropTypes, InputValidDefaultProps,
  isIPv6, isIPv4, REGEXP_HOST
} from './Base'; 
import InputValid from './Input-Valid'; 

export default class InputValidIpv4oripv6orhost extends Component {
  constructor(props) {
    super(props);
    this.hint = `IPv4/IPv6/Host`;
    this.err = `Please input correct IPv4/IPv6/Host`;
  }
  getIsValid(val) {
    return isIPv4(val) || isIPv6(val) || REGEXP_HOST.test(val);
  }
  render() {
    return (<InputValid {...this.props}  
        getIsValid={this.getIsValid.bind(this)} 
        validType="InputValidIpv4oripv6orhost" 
        hint={this.hint} 
        err={this.err} 
      />);
  }
};
InputValidIpv4oripv6orhost.propTypes = Object.assign({}, InputValidPropTypes);
InputValidIpv4oripv6orhost.defaultProps = Object.assign({}, InputValidDefaultProps);
