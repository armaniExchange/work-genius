import React, { Component } from 'react';

import {
  InputValidPropTypes, InputValidDefaultProps,
  isValidMask
} from './Base'; 
import InputValid from './Input-Valid'; 

export default class InputValidIpv6Mask extends Component {
  constructor(props) {
    super(props);
    this.hint = `IPv6 Netmask`;
    this.err = `Please input correct IPv6 Mask information`;
  }
  getIsValid(value) {
    return value && value.indexOf('/')===0 && isValidMask(value.split('/')[1], 6);
  }
  render() {
    return (<InputValid {...this.props}  
        getIsValid={this.getIsValid.bind(this)} 
        validType="InputValidIpv6Mask" 
        hint={this.hint} 
        err={this.err} 
      />);
  }
};
InputValidIpv6Mask.propTypes = Object.assign({}, InputValidPropTypes);
InputValidIpv6Mask.defaultProps = Object.assign({}, InputValidDefaultProps);
