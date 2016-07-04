import React, { Component, PropTypes } from 'react';

import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

export default class DropDownList extends Component {
    constructor(props) {
        super(props);
        this.DEFAULT_ALL_VALUE = '';
        this.htmlid = this.props.htmlid ? this.props.htmlid : 'A10DropDownList__' + Math.random().toString(36).slice(2); // http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
        this.state = {
            curDropDownListVisual2Value: this.props.title
        };
    }

    render() {
        let { title, aryOptionConfig=[], onOptionClick, isNeedAll, AllValue,
            isDropDownListVisual2
         } = this.props;

        if (isNeedAll) {
            aryOptionConfig = [ {title:'All', value:(AllValue ? AllValue : this.DEFAULT_ALL_VALUE)} ].concat(aryOptionConfig);
        }

        if (isDropDownListVisual2) {
            return (<div id={this.htmlid}>
                <SelectField
                value={this.state.curDropDownListVisual2Value}
                fullWidth={true}
                onChange={(evt, index, value)=>{
                    var name = '';
                    for (let item of aryOptionConfig) {
                        if (item.value===value) {
                            name = item.title;
                            break;
                        }
                    }
                    this.setState({curDropDownListVisual2Value: value});
                    onOptionClick && onOptionClick(value, name);
                }}>
                {aryOptionConfig.map((item, i) => {
                    return (<MenuItem key={i} value={item.value} primaryText={item.title} />);
                })}
                </SelectField>
              </div>);
        }

        return (<div style={{'display':'inline'}} id={this.htmlid}>
            {title}
            <button
                    className="mdl-button mdl-js-button mdl-button--icon">
              <i className="material-icons">more_vert</i>
            </button>
            <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect" htmlFor={this.htmlid}>
                {aryOptionConfig.map((item, i) => {
                    return (<li key={i} onClick={()=>{
                        onOptionClick && onOptionClick(item.value);
                    }} className="mdl-menu__item">{item.title}{' '}{item.subtitle ? <sup>{item.subtitle}</sup> : ''}</li>);
                })}
            </ul></div>);
    }
};

DropDownList.propTypes = {
    isDropDownListVisual2: PropTypes.bool, // change to material-ui visual from default_visual=material-lite
    htmlid: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string,PropTypes.number]),
    isNeedAll: PropTypes.bool,
    AllValue: PropTypes.oneOfType([PropTypes.string,PropTypes.number]),
    aryOptionConfig: PropTypes.array,
    onOptionClick: PropTypes.func
};
