// GraphQL
import {
    GraphQLID,
    GraphQLString,
    GraphQLList
} from 'graphql';
// Models
import BUG_TAG_TYPE from './BugTagType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let BugTagQuery = {
	'getAllBugTags': {
		type: new GraphQLList(BUG_TAG_TYPE),
		description: 'Get all bug tags',
        args: {
			name: {
				type: GraphQLString,
				description: 'bug tag name'
			}
		},
		resolve: async (root, { name}) => {
			let connection = null,
			    result = null,
			    func = tag => {
			    	if(!!name){
			    		return tag('tag_name').match(name);
			    	}
			    	return true;
			    },
				query = null;

			try {
				query = r.db('work_genius').table('bugtags').filter(func).coerceTo('array');
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				result = await query.run(connection);             
				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
	}
};

export default BugTagQuery;