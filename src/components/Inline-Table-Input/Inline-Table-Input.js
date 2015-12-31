// Styles
import './_Inline-Table-Input.scss';

// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

class InlineTableInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showInput: false
		};
		this._onEditHandler = ::this._onEditHandler;
		this._onCancelHandler = ::this._onCancelHandler;
		this._onSubmitHandler = ::this._onSubmitHandler;
	}

	_onEditHandler() {
		this.setState({
			showInput: true
		});
	}

	_onCancelHandler() {
		this.refs.input.value = '';
		this.setState({
			showInput: false
		});
	}

	_onSubmitHandler() {
		const { onSubmitHandler } = this.props;
		onSubmitHandler(this.refs.input.value);
		this.refs.input.value = '';
		this.setState({
			showInput: false
		});
	}

	render() {
		const { defaultData } = this.props;
		let { showInput } = this.state;
		let dataClass = classnames('inline-table-input__data', {
			'inline-table-input__data--hide': showInput
		});
		let inputClass = classnames('inline-table-input__input', {
			'inline-table-input__input--hide': !showInput
		});
		return (
			<td className="inline-table-input">
				<span className={dataClass}>
				    <span>{defaultData}</span>
				    <button
				        className="mdl-button mdl-js-button mdl-button--icon"
				        onClick={this._onEditHandler}>
					    <i className="material-icons">create</i>
					</button>
				</span>
				<span className={inputClass}>
				    <input
				        ref="input"
				        defaultValue={defaultData}
				    />
			    	<button
				        className="mdl-button mdl-js-button mdl-button--icon"
				        onClick={this._onSubmitHandler}>
					    <i className="material-icons">send</i>
					</button>
			    	<button
				        className="mdl-button mdl-js-button mdl-button--icon"
				        onClick={this._onCancelHandler}>
					    <i className="material-icons">clear</i>
					</button>
				</span>
			</td>
		);
	}
}

InlineTableInput.propTypes = {
	defaultData    : PropTypes.string.isRequired,
	onSubmitHandler: PropTypes.func
};
InlineTableInput.defaultProps = {
	onSubmitHandler: () => {}
};

export default InlineTableInput;
