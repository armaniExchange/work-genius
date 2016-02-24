import React, { Component, PropTypes } from 'react';

import { Button, BUTTON_TYPE } from './Button';

export default class ApproveButton extends Component {
    render() {
        return (<Button {...this.props} type={BUTTON_TYPE.APPROVE} />);
    }
};

ApproveButton.propTypes = {
    type: PropTypes.string
};