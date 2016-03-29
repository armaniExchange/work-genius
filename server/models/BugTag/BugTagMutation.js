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
				let tag = JSON.parse(data);
				if(tag.tag_name == ''){
					return false;
				}
				query = r.db('work_genius').table('bugtags').filter({tag_name:tag.tag_name}).coerceTo('array');
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				result = await query.run(connection);
				if(result && result.length > 0){
					return 'Fail to update bug tag!';
				}
				query = r.db('work_genius').table('bugtags').insert(tag);
				await query.run(connection);
				await connection.close();
			} catch (err) {
				return 'Fail to update bug tag!';
			}
			return 'Update bug tag successfully!';
		}
	}

};

export default BugTagMutation;