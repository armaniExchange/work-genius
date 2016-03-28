// GraphQL
import {
    GraphQLID,
    GraphQLString
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let BugTagMutation = {
	'createBugTag': {
		type: GraphQLString,
		description: 'create a bug tag',
        args: {
			data: {
				type: GraphQLString,
				description: 'new bug data'
			}
		},
		resolve: async (root, { data }) => {
			let connection = null,
				query = null,
				result = null;
			try {
				if(!data.tag_name){
					return false;
				}
				query = r.db('work_genius').table('bugtags').filter({tag_name:data.tag_name});
				result = await query.run(connection);
				if(result){
					return false;
				}
				query = r.db('work_genius').table('bugtags').insert(JSON.parse(data));
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				await query.run(connection);
				await connection.close();
			} catch (err) {
				return false;
			}
			return true;
		}
	}

};

export default BugMutation;