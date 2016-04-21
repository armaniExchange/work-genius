import React, { Component, PropTypes } from 'react';

class Radio extends Component {
    render() {
        const { value, name, onChange, checked } = this.props;
        return (<label className="mdl-radio">
              <input type="radio" className="mdl-radio__button" name="options" value={value} checked={checked} onChange={e=>{
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
    name: PropTypes.string,
    checked: PropTypes.bool
};

export default Radio;
