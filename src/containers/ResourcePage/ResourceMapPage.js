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
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';

class ResourceMapPage extends Component{

	constructor(){
		super();
		this._changeStartDate = ::this._changeStartDate;
        this._selectUser = ::this._selectUser;
	}

	componentWillMount() {
		let defaultStartDate = moment().isoWeekday(1).format('YYYY-MM-DD');
		const {
            totalDays,
			queryResourceMapData,
            fetchAllUsersRequest
		} = this.props;
        // User id default is 0, current user.
		queryResourceMapData(defaultStartDate, totalDays, 0);
        fetchAllUsersRequest();
	}

	_changeStartDate(date) {
		const {
            totalDays,
            currentUserId,
			queryResourceMapData
		} = this.props;
		queryResourceMapData(date, totalDays, currentUserId);
	}

    _selectUser(user) {
        const {
            totalDays,
            startDate,
            queryResourceMapData
        } = this.props;
        let defaultStartDate = moment(startDate).format('YYYY-MM-DD');
        queryResourceMapData(defaultStartDate, totalDays, user);
    }

	render () {
		const {
			startDate,
            allUsers,
            currentUserId,
			fetchResourceMapModalHandler,
            fetchResourceMapStatus,
            fetchResourceMapAddMulti,
            fetchResourceMapDeleteItem
		} = this.props;
        let userObj = allUsers.find((user) => {
            return String(user.id) === String(currentUserId);
        });

        let username = userObj ? userObj.name : 'All';
		return (
			<section>
        		<Breadcrumb data={BREADCRUMB.resourcemap} />
                    <div className = "top-selector pull-left">
                        <label>Date:&nbsp;</label>
                    </div>
                    <div className = "pull-left">
                        <DatePicker className="option-layout" defaultDate={String(startDate)} placeholder="Start Date" onChange={this._changeStartDate} />
                    </div>
                    <div className = "top-selector pull-left">
                        &nbsp;&nbsp;&nbsp;
                        <label>Owner:&nbsp;</label>
                        <DropDownList
                            isNeedAll={true}
                            title={username}
                            onOptionClick={this._selectUser}
                            aryOptionConfig={allUsers.map((user) => {
                                    return {title: user.name, value: user.id};
                                })}
                        />
                    </div>
                    <div className = "top-selector pull-right">
                        <button className="mdl-button mdl-js-button mdl-button--icon">
                            <Tooltip
                                placement="left"
                                overlay={
                                    (
                                        <div>
                                            <label>Help:</label>
                                            <br />
                                            <span>1. Click on the blanks to create work log.</span>
                                            <br />
                                            <span>2. Click item to edit work log.</span>
                                            <br />
                                            <span>3. Double click item to delete work log.</span>
                                        </div>
                                    )
                                }
                                arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
                            >
                                <i className="material-icons">help_outline</i>
                            </Tooltip>
                        </button>
                    </div>
				<ResourceMapTable
					onModalHander={fetchResourceMapModalHandler}
                    onSubmitStatus={fetchResourceMapStatus}
                    onSubmitMulti={fetchResourceMapAddMulti}
                    onDeleteItemHander={fetchResourceMapDeleteItem}
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
    currentUserId                  : PropTypes.string.isRequired,
    queryResourceMapData           : PropTypes.func.isRequired,
    fetchAllUsersRequest           : PropTypes.func.isRequired,

    fetchResourceMapDeleteItem     : PropTypes.func.isRequired,
    fetchResourceMapStatus         : PropTypes.func.isRequired,
    fetchResourceMapAddMulti       : PropTypes.func.isRequired,

    // Modal handle options.
    show                           : PropTypes.bool.isRequired,
    defaultModalInfos              : PropTypes.object.isRequired,
    upsertWorklogItem              : PropTypes.func.isRequired,
    fetchResourceMapModalHandler   : PropTypes.func.isRequired
};

ResourceMapPage.defaultProps = {
    startDate     : moment().isoWeekday(1).format('YYYY-MM-DD'),
    totalDays     : 7,
    show          : false,
    data          : [],
    currentUserId : ''
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
