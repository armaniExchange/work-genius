// GraphQL
import {
	GraphQLBoolean
} from 'graphql';

let UserQuery = {
	'isLogin': {
		type: GraphQLBoolean,
		description: 'check if the user is logged in',
		resolve: async (root) => {
			return root.request.session.uid ? true : false;
		}
	}
};

export default UserQuery;
