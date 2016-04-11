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

function dedupe(list) {
    let result = [];
    list.forEach((element) => {
        if (result.indexOf(element) === -1) {
            result.push(element);
        }
    });
    return result;
}

function getParents(categories, target) {
    if (!target.parentId) {
        return [];
    }
    let directParent = categories.filter(
        category => category.id === target.parentId
    )[0];
    return [directParent, ...getParents(categories, directParent)];
}

function filterByUserId(categories, userId) {
    let filterCategoriesWithoutParent = categories.filter(
        category => category.primary_owner === +userId || category.secondary_owner === +userId
    );
    return dedupe(filterCategoriesWithoutParent.map(
        category => [category, ...getParents(categories, category)]
    ).reduce((acc, next) => acc.concat(next), []));
}

export { transformToTree, generatePath, dedupe, filterByUserId };
