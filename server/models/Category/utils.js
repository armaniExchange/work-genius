function generateTree(dataArr, root) {
    let subTree, directChildren, subDataArr;
    let { name, id, articlesCount } = root;
    if (dataArr.length === 0) {
        return {
            id,
            name,
            articlesCount,
            subCategories: []
        };
    }
    directChildren = dataArr.filter((node) => { return node.parentId === root.id; });
    subDataArr = dataArr.filter((node) => { return node.parentId !== root.id; });
    subTree = directChildren.map((node) => {
        return generateTree(subDataArr, node);
    });
    return {
        id,
        name,
        articlesCount,
        subCategories: subTree
    };
}

function transformToTree(dataArr) {
    let root = dataArr.filter((node) => { return !node.parentId; })[0],
        rest = dataArr.filter((node) => { return node.parentId; });
    return generateTree(rest, root);
}

export { transformToTree };
