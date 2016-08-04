import React, { Component, PropTypes } from 'react';
import Table from '../A10-UI/Table/Table';

import ReleaseTableHeader from './ReleaseTableHeader';
import ReleaseTableRow from './ReleaseTableRow';

import './ReleaseCard.css';

class ReleaseTable extends Component {

  static propTypes = {
    releases: PropTypes.array.isRequired,
    editRelease: PropTypes.func.isRequired,
    deleteRelease: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      releases: []
    };
  }

  componentWillReceiveProps(nextProps) {
    const { releases } = nextProps;
    this.setState({ releases: releases });
  }

  editRelease(release) {
    const { editRelease } = this.props;
    editRelease(release);
  }

  render() {
    const { deleteRelease } = this.props;
    return (
      <Table className="table">
        <ReleaseTableHeader />
        <tbody>
          { this.state.releases.map((release, index) => {
            return (
              <ReleaseTableRow
                  key={index}
                  index={index}
                  release={release}
                  editRelease={::this.editRelease}
                  deleteRelease={deleteRelease} />);
          })}
        </tbody>
      </Table>
    );
  }

}

ReleaseTable.propTypes = {
  releases                 : PropTypes.array.isRequired,
};

export default ReleaseTable;