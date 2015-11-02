// Styles
import './_Demo.scss';
// Libraries
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
// Actions
import * as DemoActions from '../../actions/demo-actions';

class DemoPage extends Component {
	render() {
		const {demoState, demoActions} = this.props;
		const loadingClassNames = classnames({
			hide: !demoState.isLoading
		});

		return (
			<section>
				<button
				    className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
				    disabled={demoState.isLoading}
				    onClick={demoActions.decreaseCounter}>
				    <i className="material-icons">remove</i>
				</button>
			    <span>{demoState.counter}</span>
		        <button
				    className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
				    disabled={demoState.isLoading}
				    onClick={demoActions.increaseCounter}>
				    <i className="material-icons">add</i>
				</button>
			    <button onClick={demoActions.increaseCounterLater}>Increase Later</button>
			    <span className={loadingClassNames}>
			        Loading...
					<div className="mdl-spinner mdl-js-spinner is-active"></div>
			    </span>
			</section>
		);
	}
}

DemoPage.propTypes = {
	demoState: PropTypes.object.isRequired,
	demoActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return {
		demoState: state.demo.toJS()
	};
}

function mapDispatchToProps(dispatch) {
	return {
		demoActions: bindActionCreators(DemoActions, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DemoPage);
