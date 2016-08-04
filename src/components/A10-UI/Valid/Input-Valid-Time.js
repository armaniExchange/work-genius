import React, { PropTypes, Component } from 'react';

import {
  InputValidPropTypes, InputValidDefaultProps
} from './Base'; 
import InputValid from './Input-Valid'; 

export default class InputValidTime extends Component {
  constructor(props) {
    super(props);
    const { allow240000 } = this.props;
    this.END_TIME = allow240000 ? '24:00:00' : '23:59:59';
    this.hint = `HH:mm:ss 00:00:00 ~ ${this.END_TIME}`;
    this.err = `Please enter a valid time`;
  }
  getIsValid(val) {
    return /^(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]):(0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])$/.test(val) // not allowed 24:00:00
      || this.END_TIME===val // for '24:00:00'
      ;
  }
  render() {
    return (<InputValid {...this.props}  
        getIsValid={this.getIsValid.bind(this)} 
        validType="InputValidTime" 
        hint={this.hint} 
        err={this.err} 
      />);
  }
};
InputValidTime.propTypes = Object.assign({}, InputValidPropTypes, {
  allow240000: PropTypes.bool
});
InputValidTime.defaultProps = Object.assign({}, InputValidDefaultProps, {
  allow240000: false
});
