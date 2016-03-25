import React, { PropTypes, Component } from 'react';

import {
  InputValidPropTypes, InputValidDefaultProps,
  isIPv6, isIPv4, isValidMask
} from './Base'; 
import InputValid from './Input-Valid'; 

export default class InputValidIpWithMask extends Component {
  constructor(props) {
    super(props);
    const {ipv4only, ipv6only} = this.props;
    
    let txtIP = ipv4only ? 'IPv4' : ( ipv6only ? 'IPv6' : 'IP');
    this.hint = `${txtIP}/Mask`;
    this.err = `Please input correct ${txtIP} And Mask information`;
  }
  getIsValid(val) {
    const {ipv4only, ipv6only} = this.props;
    let isValid = false;
    if (val && val.indexOf('/') > 1) {
      let ary = val.split('/');
      if (!ipv6only && isIPv4(ary[0])) {
        isValid = isValidMask(ary[1], 4);
      } else if (!ipv4only && isIPv6(ary[0])) {
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
InputValidIpWithMask.propTypes = Object.assign({}, InputValidPropTypes, {
  ipv4only: PropTypes.bool,
  ipv6only: PropTypes.bool
});
InputValidIpWithMask.defaultProps = Object.assign({}, InputValidDefaultProps, {
  ipv4only: false,
  ipv6only: false
});
