import React, { Component, PropTypes } from 'react';
import Highlight from 'react-highlight';
import 'highlight.js/styles/github.css';
import './_CodeBlock.css';

export default class CodeBlock extends Component {
  render() {
    const {
      language,
      literal
    } = this.props;
    return (
      <Highlight
        className={`${language} component-codeblock`}>
        {literal}
      </Highlight>
    );
  }
}

CodeBlock.propTypes = {
  literal      : PropTypes.string,
  language     : PropTypes.string
};
