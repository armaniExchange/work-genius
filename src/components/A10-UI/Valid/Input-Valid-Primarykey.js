import React, { PropTypes, Component } from 'react';

import TextField from 'material-ui/lib/text-field';
import InValidErrMsg from './In-Valid-Err-Msg';
import {ValidWrap, getIsValidPharse1, aryEnabled} from './Base';

let strEnabled = aryEnabled.join(' ');

export default class InputValidPrimarykey extends Component {
  constructor(props) {
    super(props);
    const {min, max, defaultValue} = this.props;
    const value = defaultValue;

    this.min = min; // default is 1
    this.max = max || undefined;
    this.hasMin = min>=0;
    this.hasMax = max<=Infinity && max>=1 && max>=min;

    let hint, err;
    if (this.hasMin && this.hasMax) {
      hint = `${min} - ${max} characters. Allow ${strEnabled} and alphanumerics.`;
      err = `Please enter ${min} - ${max} characters. Allow ${strEnabled} and alphanumerics.`;
    } else if (this.hasMin) {
      hint = `More than or equal to ${min} characters. Allow ${strEnabled} and alphanumerics.`;
      err = `Please enter characters at least ${min} characters. Allow ${strEnabled} and alphanumerics.`;
    } else if (this.hasMax) {
      hint = `Less than or equal to ${max} characters. Allow ${strEnabled} and alphanumerics.`;
      err = `Please enter characters within ${max} characters. Allow ${strEnabled} and alphanumerics.`;
    } else {
      hint = `Characters only. Allow ${strEnabled} and alphanumerics.`;
      err = `Please enter characters. Allow ${strEnabled} and alphanumerics.`;
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
    let isValid = false,
        isValid1 = true,
        isValid2 = true,
        int_val = val.length || 0;

    if (this.hasMin && this.hasMax) {
      isValid1 = int_val>=this.min && int_val<=this.max;
    } else if (this.hasMin) {
      isValid1 = int_val>=this.min;
    } else if (this.hasMax) {
      isValid1 = int_val<=this.max;
    } else {
      isValid1 = typeof int_val==='number' && int_val>=-Infinity && int_val<=Infinity;
    }

    if (isValid1) {
      let regexp = new RegExp('^[' + ['a-zA-Z0-9'].concat(aryEnabled) + ']+$');
      isValid2 = regexp.test(val);
    }

    isValid = isValid1 && isValid2;
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
        onChange && onChange(VALUE);
        if (bool) {
          onValid();
        } else {
          onInValid();
        }
        this.setState({showErr: this.getShowErr(VALUE)});
      }} />
      <InValidErrMsg msg={err} show={this.state.showErr} validType="InputValidPrimarykey" />
      </ValidWrap>
    );
  }
};
InputValidPrimarykey.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  defaultValue: PropTypes.oneOfType([ //<--force only number?
      PropTypes.string,
      PropTypes.number]),
  onValid: PropTypes.func,
  onInValid: PropTypes.func,
  onChange: PropTypes.func
};
InputValidPrimarykey.defaultProps = {
  min: 1,
  onValid: () => {},
  onInValid: () => {}
};
