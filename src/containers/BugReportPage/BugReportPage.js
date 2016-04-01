import './_BugReportPage.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Actions
import * as bugReportActions from '../../actions/bug-report-actions';
import * as appActions from '../../actions/app-actions';
import * as mainActions from '../../actions/main-actions';

import DropDownList from '../../components/A10-UI/Input/Drop-Down-List.js';
import BugReportTable from '../../components/BugReportTable/BugReportTable.js';


class BugReportPage extends Component {
    constructor(props) {
        super(props);
        this._onChangeProjectVesion = ::this._onChangeProjectVesion;
    }

    componentWillMount() {
        const {
            fetchBugReportPageData,
        } = this.props;

        fetchBugReportPageData();
    }

    _onChangeProjectVesion(version){
        const {
            fetchBugReportPageData,
        } = this.props;

        fetchBugReportPageData(version);
    }

    render() {
        const {
            currentProjectVersion,
            rootCauseTableData,
            tagsTableData,
            ownerTableData,
            rootCauseTableTitleKeyMap,
            tagsTableTitleKeyMap,
            ownerTableTitleKeyMap,
            allProjectVersions,
        } = this.props;

        return (
            <section>
                {/* Project Version */}
                <label>&nbsp;&nbsp;&nbsp;&nbsp;Project:&nbsp;</label>
                <DropDownList
                    isNeedAll={false}
                    title={currentProjectVersion}
                    onOptionClick={this._onChangeProjectVesion}
                    aryOptionConfig={allProjectVersions}
                />
                <br/><br/>
                <div className="col-md-8 col-lg-8">
                  <label>Root Cause Summary:&nbsp;</label>
                  <BugReportTable
                      data={rootCauseTableData}
                      titleKeyMap={rootCauseTableTitleKeyMap}
                  />

                  <br/><br/>
                  <label>Tags Summary:&nbsp;</label>
                  <BugReportTable
                      data={tagsTableData}
                      titleKeyMap={tagsTableTitleKeyMap}
                  />

                  <br/><br/>
                  <label>Owner Summary:&nbsp;</label>
                  <BugReportTable
                      data={ownerTableData}
                      titleKeyMap={ownerTableTitleKeyMap}
                  />
                </div>
                <div className="col-md-4 col-lg-4">
                </div>
            </section>
        );
    }
}

BugReportPage.propTypes = {
    currentProjectVersion:     PropTypes.string,
    rootCauseTableData:        PropTypes.array,
    tagsTableData:             PropTypes.array,
    ownerTableData:            PropTypes.array,
    rootCauseTableTitleKeyMap: PropTypes.array,
    tagsTableTitleKeyMap:      PropTypes.array,
    ownerTableTitleKeyMap:     PropTypes.array,
    allProjectVersions:        PropTypes.array,
    fetchBugReportPageData:    PropTypes.func
};

BugReportPage.defaultProps = {
    currentProjectVersion:    ''
};

function mapStateToProps(state) {
    return Object.assign(
        {},
        state.bugReport.toJS(),
        state.app.toJS()
    );
}

function mapDispatchToProps(dispatch) {
    return Object.assign(
        {},
        bindActionCreators(bugReportActions, dispatch),
        bindActionCreators(mainActions, dispatch),
        bindActionCreators(appActions, dispatch)
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BugReportPage);
