import React, { Component, PropTypes } from 'react';

import { Button, BUTTON_TYPE } from './Button';

export default class DeleteButton extends Component {
    render() {
        return (<Button {...this.props} type={BUTTON_TYPE.DELETE} />);
    }
};

DeleteButton.propTypes = {
    type: PropTypes.string
};