import './_BugReviewPage.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Actions
import * as BugReviewActions from '../../actions/bug-review-actions';
import * as appActions from '../../actions/app-actions';
import * as mainActions from '../../actions/main-actions';

import BugReviewTable from '../../components/BugReviewTable/BugReviewTable.js';
// import DropDownList from '../../components/A10-UI/Input/Drop-Down-List.js';

// let PTOYearFilter = ({ selectedYear, goToPreviousYear, goToNextYear }) => {
//     let style = {'minWidth':'25px', 'minHeight':'25px', height:'25px', 'lineHeight':1};
//     return (
//         <div className="pto-year-filter">
//             <RaisedButton label="<" style={style} onClick={goToPreviousYear} />
//             <span style={{margin:'0 6px', display:'inline-block'}}>{selectedYear}</span>
//             <RaisedButton label=">" style={style} onClick={goToNextYear} />
//         </div>
//     );
// };

class BugReviewPage extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const { fetchBugReviewPageData } = this.props;
        // Get the init bug review page data
        fetchBugReviewPageData();
    }

    render() {
        const {
            applications,
            bugReviewTitleKeyMap,
            resolvedReasonTypes,
            resolvedReasonTypeChange,
            optionsReviewTags,
            changeReviewTagOptions,
            optionsMenus,
            changeMenuTagOptions,
            changeReviewText
        } = this.props;
        // const dropdownTitle = 'Project';
        return (
            <section className="table_layout_center">
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

            </section>
        );
    }
}

BugReviewPage.propTypes = {
    applications : PropTypes.array,
    bugReviewTitleKeyMap:      PropTypes.array,
    allProjectVersions:        PropTypes.array,
    resolvedReasonTypes:       PropTypes.array,
    optionsReviewTags:         PropTypes.array,
    optionsMenus:              PropTypes.array,
    fetchBugReviewPageData:    PropTypes.func,
    resolvedReasonTypeChange:  PropTypes.func,
    changeReviewTagOptions:    PropTypes.func,
    changeMenuTagOptions:      PropTypes.func,
    changeReviewText:          PropTypes.func
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
