import React, { PropTypes, Component } from 'react';

import {
  InputValidPropTypes, InputValidDefaultProps
} from './Base'; 
import InputValid from './Input-Valid'; 

export default class InputValidDate extends Component {
  constructor(props) {
    super(props);
    const { dateSpliter } = this.props;
    const SPLITER = dateSpliter;
    const {min, max} = this.props;
    const IS_HAS_MAX = max && max.length===8;
    const IS_HAS_MIN = min && min.length===8;
    let maxY, maxM, maxD, minY, minM, minD, maxYMD, minYMD;
    if (IS_HAS_MAX) {
        maxY = max.substr(0,4);
        maxM = max.substr(4,2);
        maxD = max.substr(6,2);
        maxYMD = [maxY, maxM, maxD].join(SPLITER);
    }
    if (IS_HAS_MIN) {
        minY = min.substr(0,4);
        minM = min.substr(4,2);
        minD = min.substr(6,2);
        minYMD = [minY, minM, minD].join(SPLITER);
    }
    console.log(min, max, 'minmax', maxYMD, minYMD);
    this.SPLITER = dateSpliter;
    this.maxYMD = maxYMD;
    this.minYMD = minYMD;
    this.exampleYMD = IS_HAS_MAX ? maxYMD : IS_HAS_MIN ? minYMD : '2015'+SPLITER+'04'+SPLITER+'25';
    this.IS_HAS_MAX = IS_HAS_MAX;
    this.IS_HAS_MIN = IS_HAS_MIN;
    this.DATE_REGEXP = new RegExp('^(1|2)[0-9][0-9][0-9]'+SPLITER+'(0[1-9]|1[012])'+SPLITER+'(0[1-9]|[12][0-9]|3[01])$');
    this.hint = IS_HAS_MAX && IS_HAS_MIN 
              ? `Between ${minYMD} ~ ${maxYMD}` 
                : IS_HAS_MAX 
                  ? 'Less than or equal to ' + maxYMD 
                  : IS_HAS_MIN
                    ? 'More than or equal to ' + minYMD
                    : 'yyyy'+SPLITER+'mm'+SPLITER+'dd';
    this.err = IS_HAS_MAX && IS_HAS_MIN 
              ? `Please input the date between ${minYMD} ~ ${maxYMD}` 
                : IS_HAS_MAX 
                  ? 'The date should be less than or equal to ' + maxYMD 
                  : IS_HAS_MIN
                    ? 'The date should be more than or equal to ' + minYMD
                    : 'The format should be yyyy'+SPLITER+'mm'+SPLITER+'dd';
  }
  getIsValid(value) {
    let isValid = this.DATE_REGEXP.test(value);
    if (isValid) {
      let aryDate,
          aryDateD,
          aryDateY;
      aryDate = value.split(this.SPLITER);
      if (aryDate[1]==='02') {
          aryDateY = aryDate[0];
          aryDateD = aryDate[2];
          if (aryDateD>29) {
              isValid = false;
          } else {
              if (aryDateY%4===0 && (aryDateY%100!==0||aryDateY%400===0) && aryDateY%4000!==0) {
                  // nothing
              } else {
                  isValid = false; // Force to false
              }
          }
      }
    }

    if (isValid && this.IS_HAS_MAX) {
      if (value>this.maxYMD) {
        isValid = false;
      }
    }

    if (isValid && this.IS_HAS_MIN) {
      if (value<this.minYMD) {
        isValid = false;
      }
    }
    return isValid;
  }
  render() {
    return (<InputValid {...this.props}  
        getIsValid={this.getIsValid.bind(this)} 
        validType="InputValidDate" 
        hint={this.hint} 
        err={this.err} 
      />);
  }
};
InputValidDate.propTypes = Object.assign({}, InputValidPropTypes, {
  dateSpliter: PropTypes.string,
  min: PropTypes.string,
  max: PropTypes.string
});
InputValidDate.defaultProps = Object.assign({}, InputValidDefaultProps, {
  dateSpliter: '-',
  min: '',
  max: ''
});
