// GraphQL
import {
    GraphQLID
} from 'graphql';
// Models
import CommentType from './CommentType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let CategoryQuery = {
	'getCommentById': {
		type: CommentType,
		description: 'Get a comment by it\'s ID',
      args: {
  			commentId: {
  				type: GraphQLID,
  				description: 'The comment id'
  			}
		},
		resolve: async (root, { commentId }) => {
			let connection = null,
			    result = null,
          author = null,
				  query = null;

			try {
				query = r.db('work_genius').table('comments').get(commentId);
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				result = await query.run(connection);
                query = r.db('work_genius').table('users').get(result['author_id']);
                author = await query.run(connection);
                result.author = author;
				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
	}
};

export default CategoryQuery;
