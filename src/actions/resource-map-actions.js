import actionTypes from '../constants/action-types';

function fetchResourceMapData(startDate) {
	return {
		type: actionTypes.FETCH_RESOURCE_MAP_DATA,
		startDate
	};
};

export function queryResourceMapData(startDate) {
	return (dispatch) => {
		dispatch(fetchResourceMapData(startDate));
	};
}
