export function generateTree(dataArr, node, parent, mergeFunction) {
  if (typeof mergeFunction !== 'function') {
    mergeFunction = () => {};
  }

  function _generateTree(_dataArr, _node, _parent) {

    if (!_node || Object.keys(_node).length === 0) {
      return {};
    }

    // need to put this function before next _generateTree,
    // so that the parent changes will take effect in the next recursive call
    Object.assign(_node, mergeFunction(_node, _parent));

    // when _dataArr is [], children is []
    const directChildren = _dataArr.filter((eachNode) => eachNode.parentId === _node.id );
    const subDataArr = _dataArr.filter((eachNode) => eachNode.parentId !== _node.id);
    const children = directChildren.map((eachNode) => _generateTree(subDataArr, eachNode, _node));

    return Object.assign({}, _node, { children });
  }
  return _generateTree(dataArr, node, parent);
};

export function depthFirstFlat(rootNode, predicate) {
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

export function sumUpFromChildrenNode(rootNode, propertyName, accumPropertyName) {
  // accumlate the number of propertyName from children and append the result to accumPropertyName
  function _sumUpFromChildrenNode(node) {
    node[propertyName] = node[propertyName] || 0;
    if (!node.children || node.children.length === 0) {
      return node[propertyName];
    } else {
      return node[accumPropertyName] = node[propertyName] + node.children
        .map(_sumUpFromChildrenNode)
        .reduce((prev,current) => prev + current, 0);
    }
  }
  return _sumUpFromChildrenNode(rootNode);
}
