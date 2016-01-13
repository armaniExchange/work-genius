// Types
import UserType from './UserType.js';

let UserQuery = {
	'currentUser': {
		type: UserType,
		description: 'Check user login status',
		resolve: async (root) => {
			return root.req.decoded;
		}
	}
};

export default UserQuery;
