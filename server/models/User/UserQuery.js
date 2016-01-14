// Types
import UserType from './UserType.js';

let UserQuery = {
	'currentUser': {
		type: UserType,
		description: 'Check user login status',
		resolve: async (root) => {
			return Object.assign({}, root.req.decoded, { token: root.req.token });
		}
	}
};

export default UserQuery;
