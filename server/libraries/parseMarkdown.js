import commonmark from 'commonmark';

export default function parseMarkdown(markdownStr) {
  const reader = new commonmark.Parser();
  const writer = new commonmark.HtmlRenderer();
  const parsed = reader.parse(markdownStr); // parsed is a 'Node' tree
  return writer.render(parsed); // result is a String
}
