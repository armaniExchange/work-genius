// Style
import './_DashboardPage.css';

// React & Redux
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


import * as dashboardActions from '../../actions/dashboard-page-actions';
import * as appActions from '../../actions/app-actions';
import * as mainActions from '../../actions/main-actions';

import bjImg from '../../assets/images/bj-group.jpg';
import tpImg from '../../assets/images/tp-group.jpg';
import sjImg from '../../assets/images/sj-group.jpg';

import ReleaseCard from '../../components/ReleaseCard';


class DashboardPage extends Component {

  static propTypes = {
    releases: PropTypes.array.isRequired,
    dashboardActions: PropTypes.object.isRequired
  }

  componentWillMount() {
    const { releaseList } = this.props.dashboardActions;
    releaseList();
  }

  render() {
    const { releases } = this.props;
    return (
      <div>
        <div className="left-bar">
          <div className="release">
            <div className="release-header">
              <h5>Release Priority</h5>
            </div>
            <ReleaseCard releases={ releases } {...this.props.dashboardActions} />
          </div>

          <div className="idea">
            <h1>More Detailed, More Beautiful</h1>
            <h2>细致些，美一些</h2>
            <h3>細緻些，美一些</h3>
            <h5>Create Better Use Experience GUI Is Our Mission</h5>
            <hr/>
            <ol>
              <li>Less Bugs, No Reopen Bugs </li>
              <li>Know Your Features Well,  Can Design More Useful Flow</li>
              <li>Learn More Useful Technology</li>
            </ol>
          </div>
        </div>

        <div className="team">
          <h5>San Jose Team</h5>
          <p><img src={sjImg}/></p>

          <h5>Beijing Team</h5>
          <p><img src={bjImg}/></p>

          <h5>Taipei Team</h5>
          <p><img src={tpImg} /></p>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return Object.assign(
    {},
    state.dashboardReducer.toJS(),
    state.app.toJS()
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dashboardActions: bindActionCreators(dashboardActions, dispatch),
    appActions: bindActionCreators(appActions, dispatch),
    mainActions: bindActionCreators(mainActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPage);
