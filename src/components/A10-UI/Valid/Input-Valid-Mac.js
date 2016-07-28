import React, { Component } from 'react';

import {
  InputValidPropTypes, InputValidDefaultProps
} from './Base'; 
import InputValid from './Input-Valid'; 

export default class InputValidMac extends Component {
  constructor(props) {
    super(props);
    this.hint = `MAC address`;
    this.err = `Please input correct MAC address information`;
  }
  getIsValid(val) {
    return /^([0-9a-fA-F]{2}[:-]){5}([0-9a-fA-F]{2})$/.test( val );
  }
  render() {
    return (<InputValid {...this.props}  
        getIsValid={this.getIsValid.bind(this)} 
        validType="InputValidMac" 
        hint={this.hint} 
        err={this.err} 
      />);
  }
};
InputValidMac.propTypes = Object.assign({}, InputValidPropTypes);
InputValidMac.defaultProps = Object.assign({}, InputValidDefaultProps);
