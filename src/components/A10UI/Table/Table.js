import React, { Component, PropTypes } from 'react';

export default class Table extends Component {
    render() {
        const { children, className, isSelectable } = this.props;
        let _defaultClassName = 'mdl-data-table mdl-js-data-table mdl-shadow--2dp' + (isSelectable ? ' mdl-data-table--selectable' : '');
        if (className) {
            _defaultClassName += ' ' + className;
        }

        return (<table {...this.props} className={_defaultClassName}>
        {children}
        </table>);
    }
};

Table.propTypes = {
    className: PropTypes.string,
    isSelectable: PropTypes.bool
};