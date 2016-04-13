import React, { Component, PropTypes } from 'react';
import Radio from './Radio';

class RadioGroup extends Component {
    /*
    constructor(props) {
        super(props);
        this._onRadioChange = ::this._onRadioChange;
    }
    _onRadioChange(curVal){
        this.props.onRadioChange(curVal);
    }*/
    render() {
        let { title, checkRadio, aryRadioConfig=[], isNeedAll, onRadioChange } = this.props;

        let ALL_DEFAULT_VALUE = '';
        if (isNeedAll) {
            aryRadioConfig = [{value:ALL_DEFAULT_VALUE, name:'All'}].concat(aryRadioConfig);
        }

        let radios = aryRadioConfig.map((item, index) => {
            let checked = checkRadio === item.value;
            
            return (
                <Radio
                    key={index}
                    value={item.value}
                    name={item.name}
                    checked={checked}
                    onChange={onRadioChange}/>
            );
        });
        if (title) {
            title += ': ';
        }
        return (
            <div className="a10-radio-group">
                {title}{radios}
            </div>
        );
    }
};

RadioGroup.propTypes = {
    title: PropTypes.string,
    checkRadio: PropTypes.string,
    aryRadioConfig: PropTypes.array,
    isNeedAll: PropTypes.bool,
    onRadioChange: PropTypes.func
};

RadioGroup.defaultProps = {
    checkRadio: '',
    onRadioChange: () => {}
};

export default RadioGroup;
