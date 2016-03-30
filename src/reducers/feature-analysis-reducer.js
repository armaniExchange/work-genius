import * as actionTypes from '../constants/action-types';
import { Map, List } from 'immutable';

const initialState = Map({
	treeDataSource: List.of()
});

// function generateTree(dataArr, root) {
//     let subTree, directChildren, subDataArr;
//     let { name, id} = root;
//     if (Object.keys(root).length === 0) {
//         return {};
//     }
//     if (dataArr.length === 0) {
//         return {
//             id,
//             name,
//             subCategories: []
//         };
//     }
//     directChildren = dataArr.filter((node) => { return node.parentId === root.id; });
//     subDataArr = dataArr.filter((node) => { return node.parentId !== root.id; });
//     subTree = directChildren.map((node) => {
//         return generateTree(subDataArr, node);
//     });
//     return {
//         id,
//         name,
//         subCategories: subTree
//     };
// }

// function transformToTree(dataArr) {
//     let root = dataArr.filter((node) => { return !node.parentId; })[0],
//         rest = dataArr.filter((node) => { return node.parentId; });
//     return generateTree(rest, root);
// }

export default function featureAnalysisReducer(state = initialState, action) {
	switch (action.type) {
		case actionTypes.FETCH_ASSIGNMENT_CATEGORIES_SUCCESS:
		    return initialState.set('treeDataSource', action.data);
		default:
			return state;
	}
};
