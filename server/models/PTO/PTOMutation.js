// GraphQL
import {
	GraphQLString
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let TaskMutation = {
	'createPTOApplication': {
		type: GraphQLString,
		description: 'Create a new pto application',
		args: {
			data: {
				type: GraphQLString,
				description: 'new pto application data'
			}
		},
		resolve: async (root, { data }) => {
			let connection = null,
				mutationQuery = null;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				mutationQuery = r.db('work_genius').table('pto').insert(JSON.parse(data));
				await mutationQuery.run(connection);
				await connection.close();
			} catch (err) {
				return err;
			}

			return 'Create successfully!';
		}
	}
};

export default TaskMutation;
