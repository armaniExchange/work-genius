// GraphQL
import {
	GraphQLList,
	GraphQLString
} from 'graphql';
// Models
import UserType from './UserType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let UserQuery = {
	'login': {
		type: UserType,
		description: 'second time real login to WG',
		args: {
			account: {
				type: GraphQLString,
				description: 'Fetch User info by account'
			}, 
			password: {
				type: GraphQLString,
				description: 'Login password '				
			}
		},
		resolve: async (root, { account, password }) => {

			// to be add auth from DB
			return [account,password];
		}
	}
};

export default UserQuery;
