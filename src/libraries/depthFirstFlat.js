export default function depthFirstFlat(rootNode, predicate) {
  if (typeof predicate !== 'function') {
    predicate = () => true;
  }

  function _depthFirstFlat(node) {
    if (typeof node.name === 'undefined'){
      return [];
    }
    node.level = node.level || 0;
    if (node.children && node.children.length > 0 && predicate(node)) {
      node.collapsed = false;
      const modifiedChildren = node.children
        .map(child => Object.assign({children: []}, child, {level: node.level + 1}))
        // .sort(child => child.name)
        // .reverse()
        // .sort(child => child.children.length === 0 )
        .map(_depthFirstFlat)
        .reduce((prev, item) => [...prev, ...item], []);
      return [node, ...modifiedChildren];
    } else {
      node.collapsed = true;
      return [node];
    }
  }

  return _depthFirstFlat(rootNode);
}
