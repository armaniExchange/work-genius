import React, { PropTypes, Component } from 'react';

import {
  InputValidPropTypes, InputValidDefaultProps,
  isValidMask, ALL_VALID_IPV4_MASK
} from './Base'; 
import InputValid from './Input-Valid'; 

export default class InputValidIpv4Mask extends Component {
  constructor(props) {
    super(props);
    this.hint = `IPv4 Netmask`;
    this.err = `Please input correct IPv4 Mask information`;
  }
  getIsValid(value) {
    let {slashmaskonly, ipaddronly} = this.props;
    // legacy code START
    var result;
    if (!slashmaskonly) {
      result = ALL_VALID_IPV4_MASK.indexOf(value)>=0;
    }
    if (!result && !ipaddronly) {  // accept "/0" ~ "/32"
      result = value && value.indexOf('/')===0 && isValidMask(value.split('/')[1], 4);
    }
    // legacy code END
    return result;
  }
  render() {
    return (<InputValid {...this.props}  
        getIsValid={this.getIsValid.bind(this)} 
        validType="InputValidIpv4Mask" 
        hint={this.hint} 
        err={this.err} 
      />);
  }
};
InputValidIpv4Mask.propTypes = Object.assign({}, InputValidPropTypes, {
  slashmaskonly: PropTypes.bool,
  ipaddronly: PropTypes.bool
});
InputValidIpv4Mask.defaultProps = Object.assign({}, InputValidDefaultProps, {
  slashmaskonly: false,
  ipaddronly: false
});
