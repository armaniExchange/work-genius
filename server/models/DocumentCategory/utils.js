function generateTree(dataArr, root) {
    let subTree, directChildren, subDataArr;
    if (!root || Object.keys(root).length === 0) {
        return {};
    }
    if (dataArr.length === 0) {
        return {
            id: root.id,
            name: root.name,
            subCategories: []
        };
    }
    directChildren = dataArr.filter((node) => { return node.parentId === root.id; });
    subDataArr = dataArr.filter((node) => { return node.parentId !== root.id; });
    subTree = directChildren.map((node) => {
        return generateTree(subDataArr, node);
    });
    return {
        id: root.id,
        name: root.name,
        subCategories: subTree
    };
};

export function transformToTree(dataArr) {
    let root = dataArr.filter((node) => { return !node.parentId; })[0],
        rest = dataArr.filter((node) => { return node.parentId; });
    return generateTree(rest, root);
}
