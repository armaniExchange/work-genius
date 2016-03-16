import React, { Component } from 'react';
import Markdown from 'react-markdown';
import CodeBlock from '../../components/CodeBlock/CodeBlock';

export default class HighlightMarkdown extends Component {
  render() {
    return (
      <Markdown
        {...this.props}
        renderers={Object.assign({}, Markdown.renderes, {
          CodeBlock
       })} />
    );
  }
}
