import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import * as ResourceMapActions from '../../actions/resource-map-actions';
import * as appActions from '../../actions/app-actions';
import * as mainActions from '../../actions/main-actions';

import Breadcrumb from '../../components/A10-UI/Breadcrumb';
import BREADCRUMB from '../../constants/breadcrumb';

import ResourceMapTable from '../../components/ResourceMapTable/ResourceMapTable.js';
import DatePicker from '../../components/A10-UI/Input/Date-Picker.js';

class ResourceMapPage extends Component{

	constructor(){
		super();
		this._changeStartDate = ::this._changeStartDate;
	}

	componentWillMount() {
		let defaultStartDate = moment().isoWeekday(1).format('YYYY-MM-DD');
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
			fetchResourceMapModalHandler
		} = this.props;
		return (
			<section>
        		<Breadcrumb data={BREADCRUMB.resourcemap} />
				<DatePicker defaultDate={String(startDate)} placeholder="Start Date" onChange={this._changeStartDate} />
				<ResourceMapTable
					onModalHander={fetchResourceMapModalHandler}
					{...this.props}
				/>
			</section>
		);
	}
}

ResourceMapPage.propTypes = {
    startDate                      : PropTypes.string.isRequired,
    totalDays                      : PropTypes.number.isRequired,
    data                           : PropTypes.array.isRequired,
    queryResourceMapData           : PropTypes.func.isRequired,

    // Modal handle options.
    show                           : PropTypes.bool.isRequired,
    defaultModalInfos              : PropTypes.object.isRequired,
    upsertWorklogItem              : PropTypes.func.isRequired,
    fetchResourceMapModalHandler   : PropTypes.func.isRequired
};

ResourceMapPage.defaultProps = {
    startDate    : new Date(),
    totalDays    : 10,
    show         : false,
    data         : []
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
