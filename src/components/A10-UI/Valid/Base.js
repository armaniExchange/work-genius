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

export const SUBNET_MIN_PREFIX = 0;
export const IPV4_SUBNET_MAX_PREFIX = 32;
export const IPV6_SUBNET_MAX_PREFIX = 128;

export const REGEXP_HOST = /^([a-zA-Z0-9\_]|[a-zA-Z0-9\_][a-zA-Z0-9\-\_]{0,29}[a-zA-Z0-9\_])(\.([a-zA-Z0-9\_]|[a-zA-Z0-9\_][a-zA-Z0-9\-\_]{0,29}[a-zA-Z0-9\_]))*$/; // see libraries/directives/forms/_validations.js for more information.

export const REGEXP_EMAIL = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{1,6}(?:\.[a-z]{1})?)$/i;

export const isDNSAscii = (val) => {
  return ! /'|"|<|>|&|\?|\r|\t|\n|\\|\//.test(val);
};

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
export const isIPv6 = (ip) => {
  ip = ip || '';
  var patrn = /^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/i,
      r = patrn.exec(ip),
      cLength = function(str) {
          var reg = /([0-9a-f]{1,4}:)|(:[0-9a-f]{1,4})/gi,
              temp = str.replace(reg, ' ');
          return temp.length;
      };

  //CDCD:910A:2222:5498:8475:1111:3900:2020
  if (r) { return true; }

  if (ip === '::') { return true; }

  //F:F:F::1:1 F:F:F:F:F::1 F::F:F:F:F:1
  if (ip.indexOf('::') !== -1) {
      patrn = /^(([0-9a-f]{1,4}:){0,6})((:[0-9a-f]{1,4}){0,6})$/i;
      r = patrn.exec(ip);
      if (r) {
          var c = cLength(ip);
          if (c <= 7 && c > 0) { return true; }
      }
  }

  //F:F:10F::
  patrn = /^([0-9a-f]{1,4}:){1,7}:$/i;
  r = patrn.exec(ip);
  if (r) { return true; }

  //::F:F:10F
  patrn = /^:(:[0-9a-f]{1,4}){1,7}$/i;
  r = patrn.exec(ip);
  if (r) { return true; }

  //F:0:0:0:0:0:10.0.0.1
  patrn = /^([0-9a-f]{1,4}:){6}(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/i;
  r = patrn.exec(ip);
  if (r && r[2] <= 255 && r[3] <= 255 &&r[4] <= 255 && r[5] <= 255) { return true; }

  //F::10.0.0.1
  patrn = /^([0-9a-f]{1,4}:){1,5}:(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/i;
  r = patrn.exec(ip);
  if (r && r[2] <= 255 && r[3] <= 255 && r[4]<= 255 && r[5] <= 255) { return true; }

  //::10.0.0.1
  patrn = /^::(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/i;
  r = patrn.exec(ip);
  if (r && r[1] <= 255 && r[2] <= 255 && r[3] <= 255 && r[4] <= 255) { return true; }

  return false;
};
export const getIPMode = (ip) => {
  return isIPv4(ip) ? 4 : (isIPv6(ip) ? 6 : 0);
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
