import React, { Component, PropTypes } from 'react';

export const BUTTON_TYPE = {
    'DONE': 'done',
    'CLEAR': 'clear',
    'APPROVE': 'done',
    'DENY': 'clear',

    'EDIT': 'edit',
    'DELETE': 'delete',
};

export class Button extends Component {
    render() {
        const { className, type='edit' } = this.props;
        let _className = 'mdl-button mdl-js-button mdl-button--icon';
        if (className) {
            _className += ' ' + className;
        }

        return (<button {...this.props} className={_className}>
            <i className="material-icons">{type}</i>
        </button>);
    }
}

Button.propTypes = {
    type: PropTypes.string,
    className: PropTypes.string
};
