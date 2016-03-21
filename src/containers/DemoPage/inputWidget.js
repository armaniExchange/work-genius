// Libraries
import React, { Component } from 'react';
import Input from './input';
import ErrorMessage from './errMsg';

class Widget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            min: 5,
            max: 10,
            errMessage: ''
        };
    }
    _check(e) {
        let val = e.target.value;
        if ((val >= this.state.min && val <= this.state.max) || val === '') {
            this.setState({
                errMessage: ''
            });
        } else {
            this.setState({
                errMessage: 'out of range'
            });
        }
    }
	render() {
        let {min, max, errMessage} = this.state;
		return (
			<section>
                <Input onInput={this._check.bind(this)} min={min} max={max}/>
                <ErrorMessage msg={errMessage}/>
			</section>
		);
	}
}

export default Widget;
