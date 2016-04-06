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
import ReactHighcharts from 'react-highcharts';

const HIGHCHARTS_DEFAULT_CONFIG_ROOT_CAUSE = {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
    },
    title: {
        text: 'Root Cause'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                color: '#000000',
                connectorColor: '#000000',
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
        }
    },
    series: []
};

const HIGHCHARTS_DEFAULT_CONFIG_TAG = {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
    },
    title: {
        text: 'Tags'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                color: '#000000',
                connectorColor: '#000000',
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
        }
    },
    series: []
};

const HIGHCHARTS_DEFAULT_CONFIG_OWNER = {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
    },
    title: {
        text: 'Owner'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                color: '#000000',
                connectorColor: '#000000',
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
        }
    },
    series: []
};

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
            ownerTotalData,
            rootCauseTableTitleKeyMap,
            tagsTableTitleKeyMap,
            ownerTableTitleKeyMap,
            allProjectVersions,
        } = this.props;

        var rootCauseData = { type: 'pie', name: 'Root Cause', xAxis: 10, yAxis: 10, data: []};
        for (let cause of rootCauseTableData) {
            cause.name = (cause.name === undefined || cause.name === '') ? 'Not Mark' : cause.name;
            let pre = [ cause.name, cause.number ];
            rootCauseData.data.push(pre);
        }

        var tagsData = { type: 'pie', name: 'Root Cause', xAxis: 10, yAxis: 500, data: [] };
        for (let tag of tagsTableData) {
            tag.name = (tag.name === undefined || tag.name === '') ? 'Not Mark' : tag.name;
            let pre = [ tag.name, tag.number ];
            tagsData.data.push(pre);
        }

        var ownerData = { type: 'pie', name: 'Owner', xAxis: 10, yAxis: 500, data: [] };
        for (let owner of ownerTotalData) {
            owner.name = (owner.name === undefined || owner.name === '') ? 'Not Mark' : owner.name;
            let pre = [ owner.name, owner.number ];
            ownerData.data.push(pre);
        }

        HIGHCHARTS_DEFAULT_CONFIG_ROOT_CAUSE.series = [];
        HIGHCHARTS_DEFAULT_CONFIG_ROOT_CAUSE.series.push(rootCauseData);

        HIGHCHARTS_DEFAULT_CONFIG_TAG.series = [];
        HIGHCHARTS_DEFAULT_CONFIG_TAG.series.push(tagsData);

        HIGHCHARTS_DEFAULT_CONFIG_OWNER.series = [];
        HIGHCHARTS_DEFAULT_CONFIG_OWNER.series.push(ownerData);
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
                <div className="col-md-12 col-lg-12">
                  <div className="col-md-12 col-lg-12">
                    <label>Root Cause Summary:&nbsp;</label>
                  </div>
                  <div className="col-md-12 col-lg-8">
                      <BugReportTable
                          data={rootCauseTableData}
                          titleKeyMap={rootCauseTableTitleKeyMap}
                      />
                  </div>
                  <div className="col-md-12 col-lg-4">
                    <ReactHighcharts config={HIGHCHARTS_DEFAULT_CONFIG_ROOT_CAUSE} />
                  </div>
                </div>

                <div className="col-md-12 col-lg-12">
                  <div className="col-md-12 col-lg-12">
                    <label>Tags Summary:&nbsp;</label>
                  </div>
                  <div className="col-md-12 col-lg-8">
                      <BugReportTable
                          data={tagsTableData}
                          titleKeyMap={tagsTableTitleKeyMap}
                      />
                  </div>
                  <div className="col-md-12 col-lg-4">
                    <ReactHighcharts config={HIGHCHARTS_DEFAULT_CONFIG_TAG} />
                  </div>
                </div>
                <div className="col-md-12 col-lg-12">
                  <div className="col-md-12 col-lg-12">
                    <label>Owner Summary:&nbsp;</label>
                  </div>
                  <div className="col-md-12 col-lg-8">
                      <BugReportTable
                          data={ownerTableData}
                          titleKeyMap={ownerTableTitleKeyMap}
                      />
                  </div>
                  <div className="col-md-12 col-lg-4">
                    <ReactHighcharts config={HIGHCHARTS_DEFAULT_CONFIG_OWNER} />
                  </div>
                </div>
            </section>
        );
    }
}

BugReportPage.propTypes = {
    currentProjectVersion:     PropTypes.string,
    rootCauseTableData:        PropTypes.array,
    tagsTableData:             PropTypes.array,
    ownerTotalData:            PropTypes.array,
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
