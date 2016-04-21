import React, { Component } from 'react';
import { connect } from 'react-redux';

import Breadcrumb from '../../components/A10-UI/Breadcrumb';
import BREADCRUMB from '../../constants/breadcrumb';

class TeamMemberPage extends Component{
  render () {
    return (
      <section>
            <Breadcrumb data={BREADCRUMB.teammember} />
            team member page here.
      </section>
    );
  }
}

TeamMemberPage.propTypes = {
};

TeamMemberPage.defaultProps = {
};

/*function mapStateToProps(state) {
    return Object.assign(
        {}
    );
}

function mapDispatchToProps(dispatch) {
    return Object.assign(
        {}
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TeamMemberPage);*/
export default connect()(TeamMemberPage);
