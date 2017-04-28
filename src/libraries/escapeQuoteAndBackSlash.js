export default function escapeQuoteAndBackSlash(str) {
  return str.replace(/\'/g, '\'').replace(/\"/g, '\"').replace(/\\/g, '\\\\');
}
