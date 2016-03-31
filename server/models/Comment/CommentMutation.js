// GraphQL
import {
    GraphQLID,
    GraphQLString
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let CategoryMutation = {
	'deleteCommentById': {
		type: GraphQLString,
		description: 'Delete a comment by it\'s ID',
        args: {
			commentId: {
				type: GraphQLID,
				description: 'The comment id'
			}
		},
		resolve: async (root, { commentId }) => {
			let connection = null,
				query = null;

			try {
				query = r.db('work_genius').table('comments').get(commentId).delete();
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				await query.run(connection);
				await connection.close();
			} catch (err) {
				return err;
			}
			return 'Deleted successfully!';
		}
	},
    'createComment': {
		type: GraphQLString,
		description: 'Create a comment by it\'s ID',
        args: {
			data: {
				type: GraphQLString,
				description: 'new comment data'
			}
		},
		resolve: async (root, { data }) => {
			let connection = null,
				query = null;

			try {
				query = r.db('work_genius').table('comments').insert(JSON.parse(data));
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				await query.run(connection);
				await connection.close();
			} catch (err) {
				return err;
			}
			return 'Created successfully!';
		}
	},
};

export default CategoryMutation;
