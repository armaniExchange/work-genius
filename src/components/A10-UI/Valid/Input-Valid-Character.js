import React, { PropTypes, Component } from 'react';

import TextField from 'material-ui/lib/text-field';
import InValidErrMsg from './In-Valid-Err-Msg';
import {
  CHARACTER_TYPE,
  ValidWrap, 
  getIsValidPharse1
} from './Base';

export default class InputValidCharacter extends Component {
  constructor(props) {
    super(props);
    const {min, max, characterType, defaultValue} = this.props;
    const value = defaultValue;

    this.characterType = characterType;
    this.min = min; // default is 1
    this.max = max || undefined;
    this.hasMin = min>=0;
    this.hasMax = max<=Infinity && max>=1 && max>=min;

    let hint, err;
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
      switch (this.characterType) {
        case CHARACTER_TYPE.ONLY_LETTER_NUMBER_SPACE:
            isValid2 = /^[a-zA-Z0-9\s]+$/.test(val);
            break;
        case CHARACTER_TYPE.ONLY_LETTER_NUMBER:
            isValid2 = /^[a-zA-Z0-9]+$/.test(val);
            break;
        case CHARACTER_TYPE.ONLY_NUMBER_SPACE:
            isValid2 = /^[0-9\s]+$/.test(val);
            break;
        case CHARACTER_TYPE.ONLY_LETTER_SPACE:
            isValid2 = /^[a-zA-Z\s]+$/.test(val);
            break;
        case CHARACTER_TYPE.ONLY_LETTER:
            isValid2 = /^[a-zA-Z]+$/.test(val);
            break;
        case CHARACTER_TYPE.ALLOW_SLASH:
            isValid2 = !/\?|\r|\t|\n|\\/.test(val);
            break;
        case CHARACTER_TYPE.ONLY_LETTER_NUMBER_SPECIALCHARACTERS:      //for vrrp-a vrid lead name
            isValid2 = /^[a-zA-Z0-9\.\:\-\_]+$/.test(val);
            break;
        case CHARACTER_TYPE.INCIDENT_NOTE: //for incident Note <textarae />
            isValid2 = true;//All character are allowed, include \r\t\n
        break;
        default:
            //before 20150716
            //return !/\?|\r|\t|\n|\\/.test(val); //remove /'"&>< for compatibility to 3.2 CLI //return !/'|"|<|>|&|\?|\r|\t|\n|\\|\//.test(val); //regexp is from 3.1 code-base
            
            //after 20150717 for bug 267386, we allow all visible characters.
            isValid2 = !/\r|\t|\n/.test(val);
      }
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
      <InValidErrMsg msg={err} show={this.state.showErr} validType="InputValidCharacter" />
      </ValidWrap>
    );
  }
};
InputValidCharacter.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  characterType: PropTypes.string,
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
