import React, { PropTypes } from 'react';

export const ValidWrap = ({children}) => {
  return (<div style={{position:'relative'}}>{children}</div>);
};
export const getIsValidPharse1 = (val) => { //deprecated
  const isEmpty = (''+val)==='';
  const isUndefined = typeof val==='undefined';
  return isEmpty || isUndefined;
};

export const aryEnabled = ['-', '_', '.'];

export const CHARACTER_TYPE = {
  ONLY_LETTER_NUMBER_SPACE: 'onlyLetterNumberSp',
  ONLY_LETTER_NUMBER: 'onlyLetterNumber',
  ONLY_NUMBER_SPACE: 'onlyNumberSp',
  ONLY_LETTER_SPACE: 'onlyLetterSp',
  ONLY_LETTER: 'onlyLetter',
  ALLOW_SLASH: 'allowSlash',
  ONLY_LETTER_NUMBER_SPECIALCHARACTERS: 'onlyLetterNumberSpecialCharacters',
  INCIDENT_NOTE: 'note'
};

export const MIN_PORT_NUM = 0;
export const MAX_PORT_NUM = 65534;

export const MIN_GRE_KEY_LENGTH = 1;
export const MAX_GRE_KEY_LENGTH = 8;



// initial for every <InputValid* />
export const InputValidPropTypes = {
  defaultValue: PropTypes.string,
  onValid: PropTypes.func,
  onInValid: PropTypes.func,
  onChange: PropTypes.func
};
export const InputValidDefaultProps = {
  onChange: () => {},
  onValid: () => {},
  onInValid: () => {}
};

export const InputValidCharacterLikePropTypes = Object.assign({}, InputValidPropTypes, {
  min: PropTypes.number,
  max: PropTypes.number
});
export const InputValidCharacterLikeDefaultProps = Object.assign({}, 
  InputValidDefaultProps, {
  min: 1
});
