function generateTree(dataArr, root) {
    let subTree, directChildren, subDataArr;
    let { name, id, articlesCount } = root;
    if (Object.keys(root).length === 0) {
        return {};
    }
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

function generatePath(dataArr, targetId) {
    let target;

    if (!targetId || !dataArr.length) {
        return '';
    }
    target = dataArr.filter((node) => { return node.id === targetId; })[0];
    if (!target.parentId) {
        return `/${target.name}`;
    }
    return `${generatePath(dataArr, target.parentId)}/${target.name}`;
}

export { transformToTree, generatePath };
