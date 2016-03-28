// GraphQL
import {
    GraphQLID,
    GraphQLString
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let BugMutation = {
	'updateBug': {
		type: GraphQLString,
		description: 'edit a bug ',
        args: {
			data: {
				type: GraphQLString,
				description: 'new bug data'
			}
		},
		resolve: async (root, { data }) => {
			let connection = null,
				query = null;

			try {
				console.log('data:');
				console.log(data);
				let bug = JSON.parse(data);
				console.log('bug:');
				console.log(bug);
				let id = null;
				if(!!bug.id){
					id = bug.id;
					delete bug.id;
				}
				if(!id){
					return false;
				}
				query = r.db('work_genius').table('bugs').get(id).update(bug);
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