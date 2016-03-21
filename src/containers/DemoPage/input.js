import React from 'react';

export default function Input({max=100, min=0, onInput=()=>{}}) {
    return (
        <input max={max} min={min} onInput={onInput}/>
    );
}
