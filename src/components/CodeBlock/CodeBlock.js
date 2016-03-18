import React, { Component, PropTypes } from 'react';
import Highlight from 'react-highlight';
import 'highlight.js/styles/github.css';

export default class CodeBlock extends Component {
  render() {
    return (
      <Highlight className={this.props.language}>
        {this.props.literal}
      </Highlight>
    );
  }
}

CodeBlock.propTypes = {
  literal      : PropTypes.string,
  language     : PropTypes.string
};
