import React, { Component, PropTypes } from 'react';

class Radio extends Component {
    render() {
        const { value, name, onChange } = this.props;
        console.log('value',value,name);
        return (<label className="mdl-radio mdl-js-radio mdl-js-ripple-effect">
              <input type="radio" className="mdl-radio__button" name="options" value={value} onChange={e=>{
                let curVal = e.target.value;
                onChange && onChange(curVal);
              }} />
              <span className="mdl-radio__label">{ name }</span>
            </label>
        );
    }
}

Radio.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    name: PropTypes.string
};

export default Radio;