import React, { Component, PropTypes } from 'react';
import Markdown from 'react-markdown';
import CodeBlock from '../../components/CodeBlock/CodeBlock';

import './_HighlightMarkdown.css';

export default class HighlightMarkdown extends Component {
  static propTypes = {
    source: PropTypes.string,
  };
  static defaultProps = {
    source: ''
  };
  render() {
    const { source } = this.props;
    return (
      <Markdown
        {...this.props}
        source={source.replace(/\\/g, '\\\\')}
        className="highlight-markdown"
        renderers={Object.assign({}, Markdown.renderes, {
          CodeBlock
       })} />
    );
  }
}
