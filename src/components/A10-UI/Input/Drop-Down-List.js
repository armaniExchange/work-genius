import React, { Component, PropTypes } from 'react';

export default class DropDownList extends Component {
    constructor(props) {
        super(props);
        this.DEFAULT_ALL_VALUE = '';
        this.htmlid = this.props.htmlid ? this.props.htmlid : 'A10DropDownList__' + Math.random().toString(36).slice(2); // http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
    }

    render() {
        let { title, aryOptionConfig=[], onOptionClick, isNeedAll, AllValue } = this.props;

        if (isNeedAll) {
            aryOptionConfig = [ {title:'All', value:(AllValue ? AllValue : this.DEFAULT_ALL_VALUE)} ].concat(aryOptionConfig);
        }

        return (<div style={{'display':'inline'}}>
            {title}
            <button id={this.htmlid}
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
    htmlid: PropTypes.string,
    title: PropTypes.string,
    isNeedAll: PropTypes.bool,
    AllValue: PropTypes.oneOfType([PropTypes.string,PropTypes.number]),
    aryOptionConfig: PropTypes.array,
    onOptionClick: PropTypes.func
};