// Style
import './_Spinner.scss';
// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

class Spinner extends Component {
	render() {
		const { hide } = this.props;

		let spinnerClass = classnames('spinner', {
			'spinner--hide': hide
		});
		return (
			<div className={spinnerClass}>
			    <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate spinner__body"></div>
			</div>
		);
	}
}

Spinner.propTypes = {
	hide: PropTypes.bool
};

Spinner.defaultProps = {
	hide: true
};

export default Spinner;
