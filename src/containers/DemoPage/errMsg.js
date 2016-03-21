import React from 'react';

export default function ErrMsg({msg='', style={}}) {
    return (
        <div style={style}>{msg}</div>
    );
}
