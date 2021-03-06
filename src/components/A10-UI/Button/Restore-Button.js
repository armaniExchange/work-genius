import React, { Component, PropTypes } from 'react';

import { Button, BUTTON_TYPE } from './Button';

export default class RestoreButton extends Component {
    render() {
        return (<Button {...this.props} type={BUTTON_TYPE.RESTORE} />);
    }
};

RestoreButton.propTypes = {
    type: PropTypes.string
};
