import './_ResourceMapPage.css';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import DropDownList from '../../components/A10-UI/Input/Drop-Down-List.js';

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
        this._selectUser = ::this._selectUser;
	}

	componentWillMount() {
		let defaultStartDate = moment().isoWeekday(1).format('YYYY-MM-DD');
		const {
			queryResourceMapData,
            fetchAllUsersRequest
		} = this.props;
        // User id default is 0, current user.
		queryResourceMapData(defaultStartDate, 0);
        fetchAllUsersRequest();
	}

	_changeStartDate(date) {
		const {
			queryResourceMapData
		} = this.props;
		queryResourceMapData(date);
	}

    _selectUser(user) {
        console.log(user);
    }

	render () {
		const {
			startDate,
            allUsers,
			fetchResourceMapModalHandler
		} = this.props;
        let userId = 569587;
        let userObj = allUsers.find((user) => {
            return String(user.id) === String(userId);
        });

        let username = userObj ? userObj.name : '';
		return (
			<section>
        		<Breadcrumb data={BREADCRUMB.resourcemap} />
                <DropDownList
                    isNeedAll={true}
                    title={username}
                    onOptionClick={this._selectUser}
                    aryOptionConfig={allUsers.map((user) => {
                            return {title: user.name, value: user.id};
                        })}
                />
				<DatePicker className="option-layout" defaultDate={String(startDate)} placeholder="Start Date" onChange={this._changeStartDate} />
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
    allUsers                       : PropTypes.array.isRequired,
    queryResourceMapData           : PropTypes.func.isRequired,
    fetchAllUsersRequest           : PropTypes.func.isRequired,

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
