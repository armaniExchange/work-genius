import React, { Component, PropTypes } from 'react';

export default class Td extends Component {
    render() {
        const { children, className, isAlignLeft, colSpan} = this.props;
        let _className = isAlignLeft ? 'mdl-data-table__cell--non-numeric' : '';
        if (className) {
            _className += ' ' + className;
        }

        return (<td {...this.props} className={_className} colSpan={colSpan}>
        {children}
        </td>);
    }
};

Td.propTypes = {
    className: PropTypes.string,
    colSpan: PropTypes.string,
    isAlignLeft: PropTypes.bool
};