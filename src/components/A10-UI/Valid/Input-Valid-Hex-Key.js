import React, { PropTypes, Component } from 'react';

import {
  InputValidPropTypes, InputValidDefaultProps,
  MIN_HEX_KEY_LENGTH, MAX_HEX_KEY_LENGTH
} from './Base'; 
import InputValid from './Input-Valid'; 

export default class InputValidHexKey extends Component {
  constructor(props) {
    super(props);
    let {min, max} = this.props;
    let minlen = min>0 ? min : MIN_HEX_KEY_LENGTH,
        maxlen = max>1 && max>min ? max : MAX_HEX_KEY_LENGTH;
    
    this.hint = `${minlen}-${maxlen} hexadecimal numbers`;
    this.err = `Hex Key should be "${minlen}-${maxlen} hexadecimal numbers`;

    this.REGEXP_HEX_KEY = RegExp('^[0-9a-fA-F]{'+minlen+','+maxlen+'}$');
  }
  getIsValid(val) {
    let {doNotCareValuesForDisplayingPassword} = this.props;
    return doNotCareValuesForDisplayingPassword.indexOf(val)>=0 // usually for inputType='password'
        || this.REGEXP_HEX_KEY.test(val);
  }
  render() {
    let {inputType} = this.props;
    return (<InputValid {...this.props}  
        getIsValid={this.getIsValid.bind(this)} 
        validType="InputValidHexKey" 
        hint={this.hint} 
        err={this.err} 
        inputType={inputType}
      />);
  }
};
InputValidHexKey.propTypes = Object.assign({}, InputValidPropTypes, {
  min: PropTypes.number,
  max: PropTypes.number,
  doNotCareValuesForDisplayingPassword: PropTypes.array,
  inputType: PropTypes.string
});
InputValidHexKey.defaultProps = Object.assign({}, InputValidDefaultProps, {
    min: 1,
    doNotCareValuesForDisplayingPassword: [],
    inputType: 'text' //<--possible 'password' for HexKey
  }
);
