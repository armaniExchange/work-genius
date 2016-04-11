import actionTypes from '../constants/action-types';
import { Map, List } from 'immutable';

const initialState = Map({
    aryOwners: [],
    aryDifficulties: [],
    updateMsgOpacity: 0,
    categoryWaitToUpdate: {},
	treeDataSource: Map({}),
    dataSource: List.of(),
	currentLeaf: Map({}),
    currentTreeSelectedUserId: ''
});

function generateTree(dataArr, root) {
    let subTree, directChildren, subDataArr;
    if (!root || Object.keys(root).length === 0) {
        return {};
    }
    if (dataArr.length === 0) {
        return {
            ...root,
            children: []
        };
    }
    directChildren = dataArr.filter((node) => { return node.parentId === root.id; });
    subDataArr = dataArr.filter((node) => { return node.parentId !== root.id; });
    subTree = directChildren.map((node) => {
        return generateTree(subDataArr, node);
    });
    return {
        ...root,
        children: subTree
    };
}

function transformToTree(dataArr) {
    let root = dataArr.filter((node) => { return !node.parentId; })[0],
        rest = dataArr.filter((node) => { return node.parentId; });
    return generateTree(rest, root);
}

function findLeaf(root, leafId) {
    if (root.id === leafId) {
        return root;
    }
    if (!root.children || root.children.length === 0) {
        return undefined;
    }
    let result = root.children
        .map((childRoot) => findLeaf(childRoot, leafId))
        .filter((res) => res);
    return result.length === 0 ? undefined : result[0];
}

export default function featureAnalysisReducer(state = initialState, action) {
	switch (action.type) {
		case actionTypes.FETCH_ASSIGNMENT_CATEGORIES_SUCCESS:
            let newTree = action.data.length > 0 ? transformToTree(action.data) : {},
                currentLeaf = state.get('currentLeaf');
            if (currentLeaf && currentLeaf.id) {
                return state.set('treeDataSource', newTree).set('currentLeaf', findLeaf(newTree, currentLeaf.id)).set('dataSource', action.data);
            } else {
                return state.set('treeDataSource', newTree).set('dataSource', action.data);;
            }
        case actionTypes.SET_CURRENT_TREE_SELECTED_USER:
		    return state.set('currentTreeSelectedUserId', action.id);
		case actionTypes.SET_CURRENT_LEAF_NODE:
		    return !action.data ? state.set('currentLeaf', undefined) : state.set('currentLeaf', action.data);
        case actionTypes.FETCH_OWNERS_SUCCESS:
            return state.set('aryOwners', action.data);
        case actionTypes.FETCH_DIFFICULTIES_SUCCESS:
            return state.set('aryDifficulties', action.data);
        case actionTypes.CHANGE_CATEGORY_WAIT_TO_UPDATE:
            let fieldname = '__unknow__';
            if (action.field==='primary_owner') {
                fieldname = 'primary_owner';
            } else if (action.field==='secondary_owner') {
                fieldname = 'secondary_owner';
            } else if (action.field==='difficulty') {
                fieldname = 'difficulty';
            }
            return state.set('categoryWaitToUpdate', Object.assign({}, state.get('categoryWaitToUpdate'), {[fieldname]: action.value}));
        case actionTypes.CHANGE_ASSIGNMENT_CATEGORY_UPDATE_MSG_OPACITY:
            return state.set('updateMsgOpacity', action.opacity);
		default:
			return state;
	}
};
