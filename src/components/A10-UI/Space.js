import React, { Component, PropTypes } from 'react';

export default class Space extends Component {
    render() {
        let {h} = this.props;
        if (/^[0-9\.]+$/.test(h)) {
            h += 'px';
        }
        return (<div style={{height: h}}></div>);
    }
};

Space.propTypes = {
    h: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};