import React, { PropTypes, Component } from 'react';

import TextField from 'material-ui/lib/text-field';
import InValidErrMsg from './In-Valid-Err-Msg';
import {
  CHARACTER_TYPE,
  ValidWrap, 
  InputValidCharacterLikePropTypes, 
  InputValidCharacterLikeDefaultProps
} from './Base';
import InputValid from './Input-Valid'; 

export default class InputValidCharacter extends Component {
  constructor(props) {
    super(props);
    const {min, max, characterType} = this.props;

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
    return (<InputValid {...this.props}  
        getIsValid={this.getIsValid.bind(this)} 
        validType="InputValidPrimarykey" 
        hint={this.hint} 
        err={this.err} 
      />);
  }
};
InputValidCharacter.propTypes = Object.assign({}, InputValidCharacterLikePropTypes); 
InputValidCharacter.defaultProps = Object.assign({}, InputValidCharacterLikeDefaultProps);
