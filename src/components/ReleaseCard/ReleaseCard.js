import React, { Component, PropTypes } from 'react';

import ReleaseForm from './ReleaseForm';
import ReleaseTable from './ReleaseTable';

class ReleaseCard extends Component {

  static propTypes = {
    releases: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {release: {}};
  }

  componentWillReceiveProps(nextProps) {
    const { releases } = nextProps;
    this.setState({ releases: releases });
  }

  editRelease(release) {
    this.setState({release: release});
  }

  editDone() {
    this.setState({release: {}});
  }

  render() {
    const { releases } = this.props;
    return (
      <div className="release-content">
        <ReleaseForm release={this.state.release} editDone={::this.editDone} {...this.props}/>
        <ReleaseTable editRelease={::this.editRelease} releases={ releases } {...this.props}/>
      </div>
    );
  }
}

export default ReleaseCard;
