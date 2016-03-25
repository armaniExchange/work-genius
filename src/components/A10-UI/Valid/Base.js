import React, { PropTypes } from 'react';

export const ValidWrap = ({children}) => {
  return (<div style={{position:'relative'}}>{children}</div>);
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

export const MIN_HEX_KEY_LENGTH = 21;
export const MAX_HEX_KEY_LENGTH = 40;

export const isValidMask = (val, ipType) => {
  var b = false,
      MAX_VAL = +ipType===6 ? 128 : 32; //32 is for ipType=4
  b = !isNaN(val) && val >= 0 && val<= MAX_VAL && val!==''; // since ""==0, we need consider and avoid this case.
  return b;
};
export const ALL_VALID_IPV4_MASK = ['255.255.255.255', '255.255.255.254', '255.255.255.252', '255.255.255.248', '255.255.255.240', '255.255.255.224', '255.255.255.192', '255.255.255.128', '255.255.255.0', '255.255.254.0', '255.255.252.0', '255.255.248.0', '255.255.240.0', '255.255.224.0', '255.255.192.0', '255.255.128.0', '255.255.0.0', '255.254.0.0', '255.252.0.0', '255.248.0.0', '255.240.0.0', '255.224.0.0', '255.192.0.0', '255.128.0.0', '255.0.0.0', '254.0.0.0', '252.0.0.0', '248.0.0.0', '240.0.0.0', '224.0.0.0', '192.0.0.0', '128.0.0.0', '0.0.0.0']; //see http://doc.m0n0.ch/quickstartpc/intro-CIDR.html
export const isIPv4 = (ip) => {
  return (/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.test(ip)) && (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256);
};


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
