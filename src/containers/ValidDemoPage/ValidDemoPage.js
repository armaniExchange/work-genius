// Libraries
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import TextField from 'material-ui/lib/text-field';
import { ValidNumber } from '../../components/A10-UI/Valid/';

class ValidDemoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num1:'kk', num2:1, num3:2, num4:'10'
    };
  }
  render() {
    return (<section>
      <h1>Valid Demo Page</h1>
      <ValidNumber defaultValue={this.state.num1} />
      <ValidNumber min={3} max={9} defaultValue={this.state.num2} />
      <ValidNumber min={3} defaultValue={this.state.num3} />
      <ValidNumber max={9} defaultValue={this.state.num4} />
      <ValidNumber max={9} defaultValue={this.state.num4} />
    </section>
    );
  }
}

export default connect()(ValidDemoPage);
