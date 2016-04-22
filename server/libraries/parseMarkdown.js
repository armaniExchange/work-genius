import commonmark from 'commonmark';

export default function parseMarkdown(markdownStr) {
  const reader = new commonmark.Parser();
  const writer = new commonmark.HtmlRenderer();
  const parsed = reader.parse(markdownStr); // parsed is a 'Node' tree
  // transform parsed if you like...
  return writer.render(parsed); // result is a String
  return markdownStr;
}
