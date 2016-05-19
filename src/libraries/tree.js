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

export function sumUpFromChildrenNode(rootNode, {init, siblingMerge, childrenParentMerge}) {
  // ex:
  // sumUpFromChildrenNode(rootNode2, {
  //   init: { accumCount: 0 },
  //   siblingMerge(prev, current) {
  //     return {
  //       accumCount: prev.accumCount + (current.count || 0) + ( current.accumCount || 0 )
  //     };
  //   },
  //   childrenParentMerge(childrenResult, current) {
  //     return {
  //       accumCount: childrenResult.accumCount + (current.count || 0)
  //     };
  //   }
  // });


  // accumlate the number of propertyName from children and append the result to accumPropertyName
  function _sumUpFromChildrenNode(node) {
    if (!node.children || node.children.length === 0) {
      return node;
    } else {
      const result = node.children
        .map(_sumUpFromChildrenNode)
        .reduce(siblingMerge, Object.assign({}, init));
      return Object.assign(node, childrenParentMerge(result, node));
    }
  }
  return _sumUpFromChildrenNode(rootNode);
}

export function filterChildren(rootNode, predicate) {
  // filtered out which doesn't meet predicate
  // if some node meet predicate
  // it shows nodes all the way to the root

  // copy root node,
  // not to mutate original data
  const copiedRootNode = Object.assign({}, rootNode);

  function _filterChildren(node) {
    const hasChildren = node.children && node.children.length > 0;
    const filteredChildren = !hasChildren ? [] : node.children
      // copy each child node
      .map(childNode => Object.assign({}, childNode ))
      .map(_filterChildren)
      .filter(childNode => predicate(childNode) || ( childNode.children && childNode.children.length > 0) );

    return Object.assign(node, {children: filteredChildren});
  }
  return _filterChildren(copiedRootNode);
}
