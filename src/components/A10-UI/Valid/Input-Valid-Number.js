import React, { PropTypes, Component } from 'react';

import TextField from 'material-ui/lib/text-field';
import InValidErrMsg from './In-Valid-Err-Msg';
import {ValidWrap, InputValidPropTypes, InputValidDefaultProps} from './Base';
import InputValid from './Input-Valid';

export default class InputValidNumber extends Component {
  constructor(props) {
    super(props);
    const {min, max} = this.props;
    
    this.min = min || undefined;
    this.max = max || undefined;
    this.hasMin = min>=-Infinity;
    this.hasMax = max<=Infinity;

    let hint, 
        err;
    if (this.hasMin && this.hasMax) {
      hint = `${this.min} - ${this.max} number`;
      err = `Number should be ${this.min} - ${this.max}`;
    } else if (this.hasMin) {
      hint = `More than or equal to ${this.min}`;
      err = `Number should be equal to or more than ${this.min}`;
    } else if (this.hasMax) {
      hint = `Less than or equal to ${this.max}`;
      err = `Number should be equal to or less than ${this.max}`;
    } else {
      hint = err = `Please enter a number`;
    }
    this.hint = hint;
    this.err = err;

  }
  getIsValid(val) {
    let int_val = +val;
    let isValid = false;
    if (this.hasMin && this.hasMax) {
      isValid = int_val>=this.min && int_val<=this.max;
    } else if (this.hasMin) {
      isValid = int_val>=this.min;
    } else if (this.hasMax) {
      isValid = int_val<=this.max;
    } else {
      isValid = typeof int_val==='number' && int_val>=-Infinity && int_val<=Infinity;
    }
    return isValid;
  }
  render() {
    return (
      <InputValid {...this.props} 
        getIsValid={this.getIsValid.bind(this)}
        validType="InputValidNumber"
        hint={this.hint}
        err={this.err}
      />
      );
  }
};

InputValidNumber.propTypes = Object.assign({}, InputValidPropTypes, 
  { min: PropTypes.number,
    max: PropTypes.number,
    defaultValue: PropTypes.oneOfType([ //<--force only number?
        PropTypes.string,
        PropTypes.number])});
InputValidNumber.defaultProps = Object.assign({}, InputValidDefaultProps);
