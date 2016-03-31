import React, { Component, PropTypes } from 'react';

export default class Th extends Component {
    render() {
        const { children, className, isAlignLeft } = this.props;
        let _className = isAlignLeft ? 'mdl-data-table__cell--non-numeric' : '';
        if (className) {
            _className += ' ' + className;
        }

        return (<th {...this.props} className={_className}>
        {children}
        </th>);
    }
};

Th.propTypes = {
    className: PropTypes.string,
    isAlignLeft: PropTypes.bool
};