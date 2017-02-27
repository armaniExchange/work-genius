import './_BugReportPage.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Actions
import * as bugPerfActions from '../../actions/bug-performance-actions';
import * as appActions from '../../actions/app-actions';
import * as mainActions from '../../actions/main-actions';

import Breadcrumb from '../../components/A10-UI/Breadcrumb';
import BREADCRUMB from '../../constants/breadcrumb';
import BugIntroducedTable from '../../components/BugIntroducedTable/BugIntroducedTable.js';
import BugModuleTable from '../../components/BugModuleTable/BugModuleTable.js';
import Select from 'react-select';


class BugPerformancePage extends Component {
    constructor(props) {
        super(props);
        this._onChangeProjectVesion = ::this._onChangeProjectVesion;
    }

    componentWillMount() {
        const {
            fetchBugPerformancePageData,
            currentProjectVersion
        } = this.props;

        fetchBugPerformancePageData(currentProjectVersion);
    }

    _onChangeProjectVesion(version){
        const {
            fetchBugPerformancePageData,
            changeCurrentProjectVersion
        } = this.props;
        changeCurrentProjectVersion(version);
        fetchBugPerformancePageData(version);
    }

    render() {

        const {
            currentProjectVersion,
            allProjectVersions,
            introducedTableData,
            introducedTableTitleKeyMap,
            moduleTableKeyMap,
            moduleTableData
        } = this.props;
        
        return (
            <section>
                <Breadcrumb data={BREADCRUMB.analysisreport} />
                <div className="row">
                    <div className="col-md-6 col-lg-6">
                        <label>Release:&nbsp;</label>
                        <Select multi  simpleValue 
                            name="release"
                            value={currentProjectVersion}
                            options={allProjectVersions}
                            onChange={this._onChangeProjectVesion}
                            placeholder="Select the release"
                        />
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-12 col-lg-12">
                        <label className="pl-15">Bug Performance:&nbsp;</label>
                      </div>
                      <div className="col-md-12 col-lg-12">
                          <BugIntroducedTable
                              data={introducedTableData}
                              titleKeyMap={introducedTableTitleKeyMap}
                          />
                      </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-12 col-lg-12">
                        <label className="pl-15">Your own module bugs:&nbsp;</label>
                      </div>
                </div>
                <div className="row">
                    <div className="col-md-6 col-lg-6">
                          <BugModuleTable
                              data={moduleTableData}
                              titleKeyMap={moduleTableKeyMap}
                          />
                      </div>
                </div>
                  
            </section>
        );
    }
}

BugPerformancePage.propTypes = {
    currentProjectVersion:     PropTypes.string,
    allProjectVersions:        PropTypes.array,
    fetchBugPerformancePageData:    PropTypes.func,
    introducedTableData:       PropTypes.array,
    introducedTableTitleKeyMap:PropTypes.array,
    changeCurrentProjectVersion: PropTypes.func,
    moduleTableKeyMap:          PropTypes.array,
    moduleTableData:            PropTypes.array
};

BugPerformancePage.defaultProps = {
    currentProjectVersion:    ''
};


function mapStateToProps(state) {
    return Object.assign(
        {},
        state.bugPerformance.toJS(),
        state.app.toJS()
    );
}

function mapDispatchToProps(dispatch) {
    return Object.assign(
        {},
        bindActionCreators(bugPerfActions, dispatch),
        bindActionCreators(mainActions, dispatch),
        bindActionCreators(appActions, dispatch)
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BugPerformancePage);
