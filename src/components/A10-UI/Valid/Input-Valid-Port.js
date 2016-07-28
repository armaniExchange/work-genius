import React, { PropTypes, Component } from 'react';

import {
  InputValidPropTypes, InputValidDefaultProps,
  MIN_PORT_NUM, MAX_PORT_NUM
} from './Base'; 
import InputValid from './Input-Valid'; 

export default class InputValidPort extends Component {
  constructor(props) {
    super(props);
    const {allow65535, allowOther} = this.props;
    const maxPort = allow65535 ? 65535 : MAX_PORT_NUM;
    this.maxPort = maxPort;
    this.OTHER_VALUE = 'other';

    this.hint = allowOther 
      ? `${MIN_PORT_NUM}-${maxPort} or ${this.OTHER_VALUE}` 
      : `${MIN_PORT_NUM}-${maxPort}`;
    this.err = allowOther 
      ? `Port should be ${MIN_PORT_NUM} ~ ${maxPort} or ${this.OTHER_VALUE}`
      : `Port should be ${MIN_PORT_NUM} ~ ${maxPort}`;
  }
  getIsValid(val) {
    const {allowOther} = this.props;
    const isValidSinglePortNum = (str) => {
      const n = +str;
      return /^\+?(0|[1-9]\d*)$/.test(str) && n>=MIN_PORT_NUM && n<=this.maxPort;
    };

    let isValid = false;
    if (val && (val+'').indexOf('-') !== -1) {
        var ports = val.split('-');
        if (ports.length===2
         && isValidSinglePortNum(ports[0])
         && isValidSinglePortNum(ports[1])
         && parseInt(ports[0])<parseInt(ports[1])
         ) {
            isValid = true;
        } else {
            isValid = false;
        }
    }
    else if (isValidSinglePortNum(val)) {
        isValid = true;
    }
    else if (val === this.OTHER_VALUE && allowOther) {
        isValid = true;
    }
    return isValid;
  }
  render() {
    return (<InputValid {...this.props}  
        getIsValid={this.getIsValid.bind(this)} 
        validType="InputValidPort" 
        hint={this.hint} 
        err={this.err} 
      />);
  }
};
InputValidPort.propTypes = Object.assign({}, InputValidPropTypes, {
  allow65535: PropTypes.bool,
  allowOther: PropTypes.bool,
  defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number])
});
InputValidPort.defaultProps = Object.assign({}, InputValidDefaultProps, {
  allow65535: true,
  allowOther: false
});
