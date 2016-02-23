import React, { Component, PropTypes } from 'react';

import { Button, BUTTON_TYPE } from './Button';

export default class EditButton extends Component {
    render() {
        return (<Button {...this.props} type={BUTTON_TYPE.DELETE} />);
    }
};

EditButton.propTypes = {
    type: PropTypes.string
};