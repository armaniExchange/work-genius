import './_BugReviewPage.css';
import './Pagination.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Actions
import * as BugReviewActions from '../../actions/bug-review-actions';
import * as appActions from '../../actions/app-actions';
import * as mainActions from '../../actions/main-actions';

import DropDownList from '../../components/A10-UI/Input/Drop-Down-List.js';

import BugReviewTable from '../../components/BugReviewTable/BugReviewTable.js';
import Pagination from 'rc-pagination';

class BugReviewPage extends Component {
    constructor(props) {
        super(props);
        this._onChangeProjectVesion = ::this._onChangeProjectVesion;
        this._onChangeSelectUser = ::this._onChangeSelectUser;
        this._onChangeSelectMenu = ::this._onChangeSelectMenu;
        this._onChangeSelectRootCause = ::this._onChangeSelectRootCause;
        this._onChangeSelectPreventTag = ::this._onChangeSelectPreventTag;
        this._onClickPaginate = ::this._onClickPaginate;
    }

    componentWillMount() {
        const { fetchBugReviewPageData, fetchPreventTagsOptions, fetchAllUsers, pager } = this.props;
        pager.rowIndex = 1;
        // Get the init bug review page data
        fetchPreventTagsOptions();
        fetchAllUsers();
        fetchBugReviewPageData(pager);
    }

    _onClickPaginate(selected) {
        const {
            fetchBugReviewPageData,
            currentSelectUser,
            currentProjectVersion,
            currentSelectMenu,
            currentSelectRootCause,
            currentSelectPreventTag,
            pager
        } = this.props;
        console.log(currentSelectUser);
        let user = currentSelectUser.value;
        user = ( user === undefined || user === '' ) ? 'All' : user;
        if (pager.rowIndex !== selected){
            pager.rowIndex = selected;
            fetchBugReviewPageData(pager, currentProjectVersion, user, currentSelectMenu, currentSelectRootCause, currentSelectPreventTag);
        }
    }

    _onChangeProjectVesion(version){
        const {
            fetchBugReviewPageData,
            currentSelectUser,
            currentSelectMenu,
            currentSelectRootCause,
            currentSelectPreventTag,
            pager
        } = this.props;
        pager.rowIndex = 1;
        let user = currentSelectUser.value;
        user = ( user === undefined || user === '' ) ? 'All' : user;
        fetchBugReviewPageData(pager, version, user, currentSelectMenu, currentSelectRootCause, currentSelectPreventTag);
    }

    _onChangeSelectUser(user){
        const {
            fetchBugReviewPageData,
            currentProjectVersion,
            currentSelectMenu,
            currentSelectRootCause,
            currentSelectPreventTag,
            pager
        } = this.props;
        pager.rowIndex = 1;
        user = ( user === undefined || user === '' ) ? 'All' : user;
        fetchBugReviewPageData(pager, currentProjectVersion, user, currentSelectMenu, currentSelectRootCause, currentSelectPreventTag);
    }

    _onChangeSelectMenu(menu) {
        const {
            fetchBugReviewPageData,
            currentProjectVersion,
            currentSelectUser,
            currentSelectRootCause,
            currentSelectPreventTag,
            pager
        } = this.props;
        pager.rowIndex = 1;
        let user = currentSelectUser.value;
        user = ( user === undefined || user === '' ) ? 'All' : user;
        fetchBugReviewPageData(pager, currentProjectVersion, user, menu, currentSelectRootCause, currentSelectPreventTag);
    }

    _onChangeSelectRootCause(rootCause) {
        const {
            fetchBugReviewPageData,
            currentProjectVersion,
            currentSelectUser,
            currentSelectMenu,
            currentSelectPreventTag,
            pager
        } = this.props;
        pager.rowIndex = 1;
        let user = currentSelectUser.value;
        user = ( user === undefined || user === '' ) ? 'All' : user;
        fetchBugReviewPageData(pager, currentProjectVersion, user, currentSelectMenu, rootCause, currentSelectPreventTag);
    }

    _onChangeSelectPreventTag(tag) {
        const {
            fetchBugReviewPageData,
            currentProjectVersion,
            currentSelectUser,
            currentSelectMenu,
            currentSelectRootCause,
            pager
        } = this.props;
        pager.rowIndex = 1;
        let user = currentSelectUser.value;
        user = ( user === undefined || user === '' ) ? 'All' : user;
        fetchBugReviewPageData(pager, currentProjectVersion, user, currentSelectMenu, currentSelectRootCause, tag);
    }

    render() {
        const {
            currentProjectVersion,
            currentSelectPreventTag,
            currentSelectMenu,
            currentSelectRootCause,
            currentSelectUser,
            applications,
            bugReviewTitleKeyMap,
            allProjectVersions,
            allUsers,
            pager,
            resolvedReasonTypes,
            resolvedReasonTypeChange,
            optionsReviewTags,
            changeReviewTagOptions,
            optionsMenus,
            changeMenuTagOptions,
            changeReviewText
        } = this.props;
        let menuTitle = currentSelectMenu === '' ? 'All' : currentSelectMenu;
        let rootCauseTitle = currentSelectRootCause === '' ? 'All' : currentSelectRootCause;
        let preventTagTitle = currentSelectPreventTag === '' ? 'All' : currentSelectPreventTag;
        return (
            <section>
                {/* Project Version */}
                <label>Project:&nbsp;</label>
                <DropDownList
                    isNeedAll={false}
                    title={currentProjectVersion}
                    onOptionClick={this._onChangeProjectVesion}
                    aryOptionConfig={allProjectVersions}
                />
                {/* Owner */}
                <label>&nbsp;&nbsp;Owner:&nbsp;</label>
                <DropDownList
                    isNeedAll={true}
                    title={currentSelectUser.title}
                    onOptionClick={this._onChangeSelectUser}
                    aryOptionConfig={allUsers}
                />
                {/* Menu */}
                <label>&nbsp;&nbsp;Menu:&nbsp;</label>
                <DropDownList
                    isNeedAll={true}
                    title={menuTitle}
                    onOptionClick={this._onChangeSelectMenu}
                    aryOptionConfig={optionsMenus.map((option) => {
                        return {title: option.label, value: option.value, subtitle: ''};
                    })}
                />
                {/* Root Cause */}
                <label>&nbsp;&nbsp;Root Cause:&nbsp;</label>
                <DropDownList
                    isNeedAll={true}
                    title={rootCauseTitle}
                    onOptionClick={this._onChangeSelectRootCause}
                    aryOptionConfig={resolvedReasonTypes.map((option) => {
                        return {title: option.label, value: option.value, subtitle: ''};
                    })}
                />
                {/* Prevent Tags */}
                <label>&nbsp;&nbsp;Prevent Tags:&nbsp;</label>
                <DropDownList
                    isNeedAll={true}
                    title={preventTagTitle}
                    onOptionClick={this._onChangeSelectPreventTag}
                    aryOptionConfig={optionsReviewTags.map((option) => {
                        return {title: option.label, value: option.value, subtitle: ''};
                    })}
                />
                <BugReviewTable
                    data={applications}
                    resolvedReasonTypes={resolvedReasonTypes}
                    resolvedReasonTypeChange={resolvedReasonTypeChange}
                    optionsReviewTags={optionsReviewTags}
                    changeReviewTagOptions={changeReviewTagOptions}
                    optionsMenus={optionsMenus}
                    changeMenuTagOptions={changeMenuTagOptions}
                    changeReviewText={changeReviewText}
                    titleKeyMap={bugReviewTitleKeyMap}
                />
                <br/>
                <div>
                    <div className="col-md-10 col-lg-10">
                        <Pagination onChange={this._onClickPaginate} pageSize={pager.pageRow} current={pager.rowIndex} total={pager.totalRow} />
                    </div>
                    <div className="col-md-2 col-lg-2">
                        <span className="float-right">Total:&nbsp;{pager.totalRow}</span>
                    </div>
                </div>
            </section>
        );
    }
}

BugReviewPage.propTypes = {
    currentProjectVersion:     PropTypes.string,
    currentSelectPreventTag:   PropTypes.string,
    currentSelectMenu:         PropTypes.string,
    currentSelectRootCause:    PropTypes.string,
    applications:              PropTypes.array,
    bugReviewTitleKeyMap:      PropTypes.array,
    allProjectVersions:        PropTypes.array,
    allUsers:                  PropTypes.array,
    resolvedReasonTypes:       PropTypes.array,
    optionsReviewTags:         PropTypes.array,
    optionsMenus:              PropTypes.array,
    currentSelectUser:         PropTypes.object,
    pager:                     PropTypes.object,
    fetchBugReviewPageData:    PropTypes.func,
    fetchPreventTagsOptions:   PropTypes.func,
    fetchAllUsers:             PropTypes.func,
    resolvedReasonTypeChange:  PropTypes.func,
    changeReviewTagOptions:    PropTypes.func,
    changeMenuTagOptions:      PropTypes.func,
    changeReviewText:          PropTypes.func
};

BugReviewPage.defaultProps = {
    currentProjectVersion:    '',
    currentSelectPreventTag:  '',
    currentSelectMenu:        '',
    currentSelectRootCause:   '',
};

function mapStateToProps(state) {
    return Object.assign(
        {},
        state.bugReview.toJS(),
        state.app.toJS()
    );
}

function mapDispatchToProps(dispatch) {
    return Object.assign(
        {},
        bindActionCreators(BugReviewActions, dispatch),
        bindActionCreators(mainActions, dispatch),
        bindActionCreators(appActions, dispatch)
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BugReviewPage);
