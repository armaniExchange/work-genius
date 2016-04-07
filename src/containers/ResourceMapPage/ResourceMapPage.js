
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import * as ResourceMapActions from '../../actions/resource-map-actions';
import * as appActions from '../../actions/app-actions';
import * as mainActions from '../../actions/main-actions';

import ResourceMapTable from '../../components/ResourceMapTable/ResourceMapTable.js';
import DatePicker from '../../components/A10-UI/Input/Date-Picker.js';

class ResourceMapPage extends Component{

	constructor(){
		super();
		this._changeStartDate = ::this._changeStartDate;
	}

	componentWillMount() {
		let defaultStartDate = moment().startOf('week').format('YYYY-MM-DD');
		const {
			queryResourceMapData
		} = this.props;
		queryResourceMapData(defaultStartDate);
	}

	_changeStartDate(date) {
		const {
			queryResourceMapData
		} = this.props;
		queryResourceMapData(date);
	}

	render () {
		const {
			startDate,
			totalDays
		} = this.props;
		console.log(startDate);
		console.log(typeof startDate);
		console.log(new Date(startDate));
		return (
			<section>
				<DatePicker defaultDate={String(startDate)} placeholder="Start Date" onChange={this._changeStartDate} />
				<ResourceMapTable
					startDate={startDate}
					totalDay={totalDays}
				/>
			</section>
		);
	}
}

ResourceMapPage.propTypes = {
	startDate:     PropTypes.string.isRequired,
	totalDays:     PropTypes.number.isRequired,
	queryResourceMapData: PropTypes.func.isRequired
};

ResourceMapPage.defaultProps = {
	startDate: new Date(),
	totalDays: 14
};

function mapStateToProps(state) {
    return Object.assign(
        {},
        state.resourceMap.toJS(),
        state.app.toJS()
    );
}

function mapDispatchToProps(dispatch) {
    return Object.assign(
        {},
        bindActionCreators(ResourceMapActions, dispatch),
        bindActionCreators(mainActions, dispatch),
        bindActionCreators(appActions, dispatch)
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ResourceMapPage);