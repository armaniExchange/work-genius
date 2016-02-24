import React, { Component, PropTypes } from 'react';

import { Button, BUTTON_TYPE } from './Button';

export default class DenyButton extends Component {
    render() {
        return (<Button {...this.props} type={BUTTON_TYPE.DENY} />);
    }
};

DenyButton.propTypes = {
    type: PropTypes.string
};