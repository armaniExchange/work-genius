import React from 'react';

export const ValidWrap = ({children}) => {
  return (<div style={{position:'relative'}}>{children}</div>);
};
export const getIsValidPharse1 = (val) => {
  const isEmpty = (''+val)==='';
  const isUndefined = typeof val==='undefined';
  return isEmpty || isUndefined;
};

export const aryEnabled = ['-', '_', '.'];
