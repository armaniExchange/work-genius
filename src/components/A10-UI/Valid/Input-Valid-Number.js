import React, { PropTypes, Component } from 'react';

import TextField from 'material-ui/lib/text-field';
import InValidErrMsg from './In-Valid-Err-Msg';
import {ValidWrap, getIsValidPharse1} from './Base';

export default class InputValidNumber extends Component {
  constructor(props) {
    super(props);
    const {min, max, defaultValue} = this.props;
    const value = defaultValue;

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

    this.state = {
      showErr: this.getShowErr(value),
      value: value
    };
  }
  getShowErr(val) {
    return !this.getIsValid(val);
  }
  getIsValid(val) {
    if (getIsValidPharse1(val)) {
      return true;
    }
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
    const {onChange, onValid, onInValid, defaultValue} = this.props;
    const value = defaultValue;
    let hint = this.hint,
        err = this.err;

    return (<ValidWrap>
      <TextField defaultValue={value} hintText={hint} onChange={evt=>{
        const VALUE = evt.target.value;
        const bool = this.getIsValid(VALUE);
        onChange(VALUE);
        if (bool) {
          onValid();
        } else {
          onInValid();
        }
        this.setState({showErr: this.getShowErr(VALUE)});
      }} />
      <InValidErrMsg msg={err} show={this.state.showErr} validType="InputValidNumber" />
      </ValidWrap>
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
