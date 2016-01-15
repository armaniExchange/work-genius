// GraphQL
import {
	GraphQLString
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Types
import PTOType from './PTOType.js';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let TaskMutation = {
	'createPTOApplication': {
		type: PTOType,
		description: 'Create a new pto application',
		args: {
			data: {
				type: GraphQLString,
				description: 'new pto application data'
			}
		},
		resolve: async (root, { data }) => {
			let connection = null,
			    getQuery = null,
				mutationQuery = null,
				result = null;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				mutationQuery = r.db('work_genius').table('pto').insert(JSON.parse(data));
				result = await mutationQuery.run(connection);
				getQuery = r.db('work_genius').table('pto').get(result.generated_keys[0]);
				result = await getQuery.run(connection);
				await connection.close();
			} catch (err) {
				return err;
			}

			return result;
		}
	},
	'deletePTOApplication': {
		type: PTOType,
		description: 'Delete a pto application',
		args: {
			id: {
				type: GraphQLString,
				description: 'pto application id to be deleted'
			}
		},
		resolve: async (root, { id }) => {
			let connection = null,
			    getQuery = null,
				mutationQuery = null,
				result = null;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				getQuery = r.db('work_genius').table('pto').get(id);
				mutationQuery = r.db('work_genius').table('pto').get(id).delete();
				result = await getQuery.run(connection);
				await mutationQuery.run(connection);
				await connection.close();
			} catch (err) {
				return err;
			}

			return result;
		}
	},
	'updatePTOApplicationStatus': {
		type: PTOType,
		description: 'Update a pto application',
		args: {
			id: {
				type: GraphQLString,
				description: 'pto application id to be deleted'
			},
			status: {
				type: GraphQLString,
				description: 'new pto application status'
			}
		},
		resolve: async (root, { id, status }) => {
			let connection = null,
				getQuery = null,
				mutationQuery = null,
				result = null;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				getQuery = r.db('work_genius').table('pto').get(id);
				mutationQuery = r.db('work_genius').table('pto').get(id).update({
					status: status
				});
				await mutationQuery.run(connection);
				result = await getQuery.run(connection);
				await connection.close();
			} catch (err) {
				return err;
			}

			return result;
		}
	}
};

export default TaskMutation;
