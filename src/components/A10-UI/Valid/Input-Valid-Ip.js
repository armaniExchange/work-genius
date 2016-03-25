import React, { PropTypes, Component } from 'react';

import {
  InputValidPropTypes, InputValidDefaultProps,
  getIPMode, isIPv6, isIPv4
} from './Base'; 
import InputValid from './Input-Valid'; 

export default class InputValidIp extends Component {
  constructor(props) {
    super(props);
    const {ipv4only, ipv6only} = this.props;

    let aryHint = [], 
        aryIP = [];
    if (!ipv6only) { 
      aryHint.push('A.B.C.D');
      aryIP.push('IPv4'); 
    }
    if (!ipv4only) { 
      aryHint.push('A:B:C:D:E:F:G:H');
      aryIP.push('IPv6'); 
    }

    this.hint = aryHint.join('/');
    this.err = `Please input correct ${aryIP.join('/')} information`;
  }
  getIsValid(val) {
    const {ipv4only, ipv6only, ipno0} = this.props;
    return (getIPMode(val)>0 && !ipv4only && !ipv6only)
      || (isIPv6(val) && ipv6only)
      || (isIPv4(val) && ipv4only 
          && ( !ipno0 || (ipno0&&val!=='0.0.0.0') )
          );
  }
  render() {
    return (<InputValid {...this.props}  
        getIsValid={this.getIsValid.bind(this)} 
        validType="InputValidIp" 
        hint={this.hint} 
        err={this.err} 
      />);
  }
};
InputValidIp.propTypes = Object.assign({}, InputValidPropTypes, {
  ipv4only: PropTypes.bool,
  ipv6only: PropTypes.bool,
  ipno0: PropTypes.bool
});
InputValidIp.defaultProps = Object.assign({}, InputValidDefaultProps, {
  ipv4only: false,
  ipv6only: false,
  ipno0: false
});
