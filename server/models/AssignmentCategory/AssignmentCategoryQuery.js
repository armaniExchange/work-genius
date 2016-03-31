// GraphQL
import {
	GraphQLList,
	GraphQLString
} from 'graphql';
// Models
import AssignmentCategoryType from './AssignmentCategoryType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';
// Utils
import { transformToTree, generatePath, dedupe } from './utils.js';

let CategoryQuery = {
	'getAllAssignmentCategories': {
		type: new GraphQLList(AssignmentCategoryType),
		description: 'Get all assignment categories',
		resolve: async () => {
			let connection = null,
			    result = null,
				query = null;

			try {
				query = r.db('work_genius').table('assignment_categories').coerceTo('array');
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				result = await query.run(connection);
				result = result.map((category, index, arr) => {
					return {
						...category,
						path: generatePath(arr, category.id)
					};
				});
				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
	},
    'getAssignmentCategoryTree': {
		type: AssignmentCategoryType,
		description: 'Get all assignment categories in tree form',
		resolve: async () => {
			let connection = null,
			    result = null,
				query = null;

			try {
				query = r.db('work_genius').table('assignment_categories').coerceTo('array');
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				result = await query.run(connection);
                result = transformToTree(result);
				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
	},
	'getAllTags': {
		type: new GraphQLList(GraphQLString),
		description: 'Get all documentation tags',
		resolve: async () => {
			let connection = null,
			    result = null,
				query = null;

			try {
				query = r.db('work_genius').table('articles').coerceTo('array');
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				result = await query.run(connection);
				result = result.reduce((acc, article) => {
					return acc.concat(article.tags);
				}, []);
				result = dedupe(result);
				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
	}
};

export default CategoryQuery;
