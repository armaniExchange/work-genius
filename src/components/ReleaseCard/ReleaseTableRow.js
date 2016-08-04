import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Td from '../A10-UI/Table/Td';

import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';

const PRIORITY_OPTIONS = {
  1: 'High',
  5: 'Middle',
  9: 'Low'
};

class ReleaseTableRow extends Component {

  static propTypes = {
    release: PropTypes.object.isRequired,
    editRelease: PropTypes.func.isRequired,
    deleteRelease: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);
  }

  toDeleteRelease() {
    const { release, deleteRelease } = this.props;
    deleteRelease(release);
  }

  toEditRelease() {
    const { release, editRelease } = this.props;
    editRelease(release);
  }

  render() {
    const { release, index } = this.props;
    let styles = {};
    (index === 0) && (styles = {
      backgroundColor: '#CC3333',
      color: '#FFF'});
    (index === 1) && (styles.backgroundColor = '#CCCC33');
    return (
      <tr style={ styles }>
        <Td className="text-center">{release.name}</Td>
        <Td className="text-center">{moment(release.date).format('YYYY-MM-DD')}</Td>
        <Td className="text-center">{PRIORITY_OPTIONS[release.priority]}</Td>
        <Td className="text-center">
          <ButtonGroup>
            <Button bsSize="xs" bsStyle="primary"
                onClick={ ::this.toEditRelease }>
              <i className="fa fa-edit" />
              &nbsp;Edit
            </Button>
            <Button bsSize="xs" bsStyle="danger"
                onClick={ ::this.toDeleteRelease }>
              <i className="fa fa-trash-o" />
              &nbsp;Delete
            </Button>
          </ButtonGroup>
        </Td>
      </tr>
    );
  }
}

export default ReleaseTableRow;
