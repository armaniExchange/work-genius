// GraphQL
import {
	GraphQLList
} from 'graphql';
// Models
import CategoryType from './CategoryType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';
// Utils
import { transformToTree } from './utils.js';

let CategoryQuery = {
	'getAllCategories': {
		type: new GraphQLList(CategoryType),
		description: 'Get all documentation categories',
		resolve: async () => {
			let connection = null,
			    result = null,
				query = null;

			try {
				query = r.db('work_genius').table('categories').coerceTo('array');
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				result = await query.run(connection);
				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
	},
    'getCategoryTree': {
		type: CategoryType,
		description: 'Get all documentation categories in tree form',
		resolve: async () => {
			let connection = null,
			    result = null,
				query = null;

			try {
				query = r.db('work_genius').table('categories').coerceTo('array');
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
};

export default CategoryQuery;
