// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
// Styles
import './Name-Filter.css';

class NameFilter extends Component {
	constructor(props) {
		super(props);
		this._onClickHandler = ::this._onClickHandler;
	}
	_onClickHandler() {
		const { name, onClickHandler } = this.props;
		onClickHandler(name);
	}
	render() {
		const { name, subtitle, selected } = this.props;
		let filterClass = classnames({
			'name-filter': true,
			'selected'   : selected
		});
		return (
	        <div className={filterClass} onClick={this._onClickHandler}>
	        	<div>{ name }</div>
	        	<div>({ subtitle })</div>
	        </div>
		);
	}
}

NameFilter.propTypes = {
	name          : PropTypes.string.isRequired,
	subtitle      : PropTypes.string,
	selected      : PropTypes.bool,
	onClickHandler: PropTypes.func
};

NameFilter.defaultProps = {
	subtitle      : '',
	selected      : false,
	onClickHandler: () => {}
};

export default NameFilter;
