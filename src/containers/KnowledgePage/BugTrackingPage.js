// Style
import './_BugTrackingPage.css';
// React & Redux
import React, { Component } from 'react';
import Breadcrumb from '../../components/A10-UI/Breadcrumb';
import BREADCRUMB from '../../constants/breadcrumb';

class BugTrackingPage extends Component {
  render() {
    return (
      <section>
        <Breadcrumb data={BREADCRUMB.bugtracking} />
        BugTracking Page
      </section>
    );
  }
}

export default BugTrackingPage;
