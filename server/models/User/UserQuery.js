// GraphQL
import {
	GraphQLList
} from 'graphql';
// Types
import UserType from './UserType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let UserQuery = {
	'currentUser': {
		type: UserType,
		description: 'Check current login user',
		resolve: async (root) => {
			let user = root.req.decoded,
			    connection = null,
			    result = null,
			    query = null;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				query = r.db('work_genius').table('users').get(user.id);
				result = await query.run(connection);
				await connection.close();
				if (result) {
					return Object.assign({}, root.req.decoded, { token: root.req.token });
				}
				throw new Error('Invalid user');
			} catch (err) {
				return err;
			}
		}
	},
	'allUserWithPto': {
		type: new GraphQLList(UserType),
		description: 'Get all users',
		resolve: async () => {
			let connection = null,
				users = null,
			    result = [],
			    query = null,
			    pto = null;

			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				query = r.db('work_genius').table('users').filter({}).coerceTo('array');
				users = await query.run(connection);
				for (let user of users) {
					query = r.db('work_genius').table('pto').filter({
						applicant_id: user.id
					}).coerceTo('array');
					pto = await query.run(connection);
					result.push(Object.assign(
						{},
						user,
						{ pto }
					));
				}
				await connection.close();
				return result;
			} catch (err) {
				return err;
			}
		}
	}
};

export default UserQuery;
