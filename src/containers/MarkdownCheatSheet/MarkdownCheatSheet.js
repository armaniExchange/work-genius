// Style
import './_MarkdownCheatSheet.scss';
// React & Redux
import React, { Component } from 'react';

import Paper from 'material-ui/lib/paper';

import HighlightMarkdown from '../../components/HighlightMarkdown/HighlightMarkdown';
import MarkdownCheatSheetMd from './Markdown-Cheatsheet.md';

class MarkdownCheatSheet extends Component {

  render() {
    return (
      <section className="markdown-cheatsheet">
        <h3>Markdown Cheatsheet</h3>
        <Paper zDepth={1}>
          <HighlightMarkdown source={MarkdownCheatSheetMd} />
        </Paper>
      </section>
    );
  }
}

export default MarkdownCheatSheet;
