import React, { PropTypes, Component } from 'react';

import TextField from 'material-ui/lib/text-field';
import InValidErrMsg from './In-Valid-Err-Msg';
import {
  ValidWrap, 
  getIsValidPharse1, 
  // aryEnabled //<--TODO: need?
} from './Base';

export default class InputValidCharacter extends Component {
  constructor(props) {
    super(props);
    const {min, max, defaultValue} = this.props;
    const value = defaultValue;

    this.min = min || undefined;
    this.max = max || undefined;

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
    let isValid = false;
    return isValid;
  }
  render() {
    const {onChange, onValid, onInValid, defaultValue} = this.props;
    const value = defaultValue;
    let hint = '',
        err = '';

    if (this.hasMin && this.hasMax) {
      hint = `${this.min} - ${this.max} characters`;
      err = `Please enter ${this.min} - ${this.max} characters`;
    } else if (this.hasMin) {
      hint = `More than or equal to ${this.min} characters`;
      err = `Please enter characters at least ${this.min} characters`;
    } else if (this.hasMax) {
      hint = `Less than or equal to ${this.max} characters`;
      err = `Please enter characters within ${this.max} characters`;
    } else {
      hint = `Please enter characters`;
      err = `Please enter characters`;
    }

    return (<ValidWrap>
      <TextField defaultValue={value} hintText={hint} onChange={evt=>{
        const VALUE = evt.target.value;
        const bool = this.getIsValid(VALUE);
        onChange && onChange(VALUE);
        if (bool) {
          onValid && onValid();
        } else {
          onInValid && onInValid();
        }
        this.setState({showErr: this.getShowErr(VALUE)});
      }} />
      <InValidErrMsg msg={err} show={this.state.showErr} validType="InputValidCharacter" />
      </ValidWrap>
    );
  }
};
InputValidCharacter.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  defaultValue: PropTypes.oneOfType([ //<--force only number?
      PropTypes.string,
      PropTypes.number]),
  onValid: PropTypes.func,
  onInValid: PropTypes.func,
  onChange: PropTypes.func
};
InputValidCharacter.defaultProps = {
  min: 1,
  onValid: () => {},
  onInValid: () => {}
};
