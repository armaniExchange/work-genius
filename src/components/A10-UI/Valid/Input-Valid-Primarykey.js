import React, { PropTypes, Component } from 'react';

import TextField from 'material-ui/lib/text-field';
import InValidErrMsg from './In-Valid-Err-Msg';
import {
  ValidWrap, InputValidCharacterLikePropTypes, InputValidCharacterLikeDefaultProps, 
  aryEnabled
} from './Base'; 
import InputValid from './Input-Valid'; 

let strEnabled = aryEnabled.join(' ');

export default class InputValidPrimarykey extends Component {
  constructor(props) {
    super(props);
    const {min, max} = this.props;

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
  }
  getIsValid(val) {
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
    return (<InputValid {...this.props}  
        getIsValid={this.getIsValid.bind(this)} 
        validType="InputValidPrimarykey" 
        hint={this.hint} 
        err={this.err} 
      />);
  }
};
InputValidPrimarykey.propTypes = Object.assign({}, InputValidCharacterLikePropTypes);
InputValidPrimarykey.defaultProps = Object.assign({}, InputValidCharacterLikeDefaultProps);
