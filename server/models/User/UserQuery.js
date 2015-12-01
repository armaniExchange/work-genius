// GraphQL
import {
	GraphQLString
} from 'graphql';

// Models
// import UserType from './UserType.js';

let UserQuery = {
	'login': {
		type: GraphQLString,
		description: 'second time real login to WG',
		resolve: async (root) => {
			let session = root.request.session;
			// to be add auth from DB

			return session.uid;
		}
	}
};

export default UserQuery;
