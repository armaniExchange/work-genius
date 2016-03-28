import React, { Component } from 'react';

import {
  InputValidPropTypes, InputValidDefaultProps,
  REGEXP_LINUX_ABS_FILEPATH
} from './Base'; 
import InputValid from './Input-Valid'; 

export default class InputValidFilepath extends Component {
  constructor(props) {
    super(props);
    this.hint = `/path/to/your/remote/filename.extension`;
    this.err = `Invalid filepath`;
  }
  getIsValid(val) {
    return REGEXP_LINUX_ABS_FILEPATH.test(val) //allow absolute filepath value
        || REGEXP_LINUX_ABS_FILEPATH.test(`/${val}`) //allow relative filepath value
        ;
  }
  render() {
    return (<InputValid {...this.props}  
        getIsValid={this.getIsValid.bind(this)} 
        validType="InputValidFilepath" 
        hint={this.hint} 
        err={this.err} 
      />);
  }
};
InputValidFilepath.propTypes = Object.assign({}, InputValidPropTypes);
InputValidFilepath.defaultProps = Object.assign({}, InputValidDefaultProps);
