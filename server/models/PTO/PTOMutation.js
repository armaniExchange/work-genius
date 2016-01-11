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
	},
	'deletePTOApplication': {
		type: GraphQLString,
		description: 'Delete a pto application',
		args: {
			id: {
				type: GraphQLString,
				description: 'pto application id to be deleted'
			}
		},
		resolve: async (root, { id }) => {
			let connection = null,
				mutationQuery = null;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				mutationQuery = r.db('work_genius').table('pto').get(id).delete();
				await mutationQuery.run(connection);
				await connection.close();
			} catch (err) {
				return err;
			}

			return 'Delete successfully!';
		}
	},
	'updatePTOApplicationStatus': {
		type: GraphQLString,
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
				mutationQuery = null;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				mutationQuery = r.db('work_genius').table('pto').get(id).update({
					status: status
				});
				await mutationQuery.run(connection);
				await connection.close();
			} catch (err) {
				return err;
			}

			return 'Delete successfully!';
		}
	}
};

export default TaskMutation;
