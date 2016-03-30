import * as actionTypes from '../constants/action-types';
import { Map } from 'immutable';

const initialState = Map({
	treeDataSource: Map({}),
	isFormVisible: false,
	currentLeafId: -1
});

function generateTree(dataArr, root) {
    let subTree, directChildren, subDataArr;
    let { name, id} = root;
    if (Object.keys(root).length === 0) {
        return {};
    }
    if (dataArr.length === 0) {
        return {
            id,
            name,
            children: []
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
        children: subTree
    };
}

function transformToTree(dataArr) {
    let root = dataArr.filter((node) => { return !node.parentId; })[0],
        rest = dataArr.filter((node) => { return node.parentId; });
    return generateTree(rest, root);
}

export default function featureAnalysisReducer(state = initialState, action) {
	switch (action.type) {
		case actionTypes.FETCH_ASSIGNMENT_CATEGORIES_SUCCESS:
		    return state.set('treeDataSource', transformToTree(action.data));
		case actionTypes.SET_CURRENT_LEAF_NODE:
		    return state.set('currentLeafId', action.id);
		case actionTypes.SET_FORM_VISIBILITY:
		    return state.set('isFormVisible', action.status);
		default:
			return state;
	}
};
