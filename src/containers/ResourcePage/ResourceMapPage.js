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
// import DatePicker from '../../components/A10-UI/Input/Date-Picker.js';
import { DateField } from 'react-date-picker';
import 'react-date-picker/index.css';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import RaisedButton from 'material-ui/lib/raised-button';

class ResourceMapPage extends Component{

	constructor(){
		super();
		this._changeStartDate = ::this._changeStartDate;
        this._selectUser = ::this._selectUser;
        this.state = {startDate: '2016-07-10'};
	}

	componentWillMount() {
		let defaultStartDate = moment().weekday(0).format('YYYY-MM-DD');
		const {
            totalDays,
            queryResourceMapRelease,
			queryResourceMapData,
            fetchAllUsersRequest,
            queryResourceMapTags,
						queryTaskTitle
		} = this.props;
        // User id default is 0, current user.
		queryResourceMapData(defaultStartDate, totalDays, 0);
        fetchAllUsersRequest();
        queryResourceMapRelease();
        queryResourceMapTags();
        queryTaskTitle();
	}

    componentWillReceiveProps (nextProps) {
        const {
            startDate
        } = nextProps;
        this.setState({startDate: startDate});
    }

	_changeStartDate(date) {
		const {
            totalDays,
            currentUserId,
			queryResourceMapData
		} = this.props;
		queryResourceMapData(date, totalDays, currentUserId);
	}

    prevMonthResourceMap() {
        const { startDate } = this.props;
        let newDate = moment(startDate).subtract(1, 'months').format('YYYY-MM-DD');
        this._changeStartDate(newDate);
        // console.log(startDate, newDate);
    }

    prevWeekResourceMap() {
        const { startDate } = this.props;
        let newDate = moment(startDate).subtract(7, 'days').format('YYYY-MM-DD');
        this._changeStartDate(newDate);
        // console.log(startDate, newDate);
    }

    nextWeekResourceMap() {
        const { startDate } = this.props;
        let newDate = moment(startDate).add(7, 'days').format('YYYY-MM-DD');
        this._changeStartDate(newDate);
        // console.log(startDate, newDate);
    }

    nextMonthReourceMap() {
        const { startDate } = this.props;
        let newDate = moment(startDate).add(1, 'months').format('YYYY-MM-DD');
        this._changeStartDate(newDate);
        // console.log(startDate, newDate);
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
            allUsers,
            currentUserId,
			fetchResourceMapModalHandler,
            fetchResourceMapStatus,
            fetchResourceMapAddMulti,
            fetchResourceMapDeleteItem,
            addResourceMapTag,
            addResourceMapRelease
		} = this.props;
        let userObj = allUsers.find((user) => {
            return String(user.id) === String(currentUserId);
        });

        let username = userObj ? userObj.name : 'All';
        let style = {'minWidth':'25px', 'minHeight':'25px', height:'25px', 'lineHeight':1};
		return (
			<section>
        		<Breadcrumb data={BREADCRUMB.resourcemap} />
                    <div className = "top-selector pull-left">
                        <RaisedButton
                            title="Prev Month"
                            label="<<"
                            style={style}
                            onClick={ ::this.prevMonthResourceMap }/>
                            &nbsp;&nbsp;
                        <RaisedButton
                            title="Prev Week"
                            label="<"
                            style={style}
                            onClick={ ::this.prevWeekResourceMap }/>
                            &nbsp;&nbsp;
                    </div>
                    <div className = "pull-left" style={{ width: '160px', paddingTop: '7px' }}>
                        {/*<DatePicker className="option-layout" fullWidth={true} defaultDate={startDate} placeholder="Start Date" onChange={this._changeStartDate} />*/}
                        <DateField
                            value={this.state.startDate}
                            onChange={this._changeStartDate}
                            dateFormat="YYYY-MM-DD"/>
                    </div>
                    <div className = "top-selector pull-left">
                            &nbsp;&nbsp;
                        <RaisedButton
                            title="Next Week"
                            label=">"
                            style={style}
                            onClick={ ::this.nextWeekResourceMap } />
                            &nbsp;&nbsp;
                        <RaisedButton
                            title="Next Month"
                            label=">>"
                            style={style}
                            onClick={ ::this.nextMonthReourceMap } />
                            &nbsp;&nbsp;&nbsp;
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
                    onAddTagHandler={addResourceMapTag}
                    onAddReleaseHandler={addResourceMapRelease}
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
    titles                         : PropTypes.array.isRequired,
    currentUserId                  : PropTypes.string.isRequired,
    tags                           : PropTypes.array.isRequired,
    releases                       : PropTypes.array.isRequired,
    queryResourceMapData           : PropTypes.func.isRequired,
    fetchAllUsersRequest           : PropTypes.func.isRequired,
		queryTaskTitle                 : PropTypes.func.isRequired,

    fetchResourceMapDeleteItem     : PropTypes.func.isRequired,
    fetchResourceMapStatus         : PropTypes.func.isRequired,
    fetchResourceMapAddMulti       : PropTypes.func.isRequired,
    queryResourceMapTags           : PropTypes.func.isRequired,
    addResourceMapTag              : PropTypes.func.isRequired,
    queryResourceMapRelease        : PropTypes.func.isRequired,
    addResourceMapRelease          : PropTypes.func.isRequired,

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
    tags          : [],
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
