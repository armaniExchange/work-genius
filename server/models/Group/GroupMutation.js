// GraphQL
import {
    GraphQLID,
    GraphQLString
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let GroupMutation = {
	'createGroup': {
		type: GraphQLString,
		description: 'create a group',
        args: {
			data: {
				type: GraphQLString,
				description: 'new group data'
			}
		},
		resolve: async (root, { data }) => {
			let connection = null,
				query = null;

			try {
				
				let group = JSON.parse(data);
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				query = r.db('work_genius').table('groups').insert(group);
				let result = await query.run(connection);
				await connection.close();
				let id = '';
			    if (result && result.generated_keys && result.generated_keys.length > 0){
			      id = result.generated_keys[0];
			    }
		        return id;
			} catch (err) {
				console.log(err);
				await connection.close();
				return 'Fail to create a group!';
			}
		}
	},
	'updateGroup': {
		type: GraphQLString,
		description: 'update a group',
        args: {
        	id: {
				type: GraphQLID,
				description: 'group id'
        	},
			data: {
				type: GraphQLString,
				description: 'new group data'
			}
		},
		resolve: async (root, { id,data }) => {
			let connection = null,
				query = null;

			try {
				
				let group = JSON.parse(data);
				if(group.id){
					delete group.id;
				}
				query = r.db('work_genius').table('groups').get(id).update(group);
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				await query.run(connection);
				await connection.close();
			} catch (err) {
				await connection.close();
				console.log(err);
				return 'Fail to update a group!';
			}
			return 'Update group successfully!';
		}
	},
	'deleteGroup': {
		type: GraphQLString,
		description: 'delete a group ',
        args: {
        	id: {
				type: GraphQLID,
				description: 'group id'
        	}
		},
		resolve: async (root, { id }) => {
			let connection = null,
				query = null;

			try {
				
				query = r.db('work_genius').table('groups').get(id).delete();
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				await query.run(connection);
				await connection.close();
			} catch (err) {
				await connection.close();
				console.log(err);
				return 'Fail to delete a group!';
			}
			return 'Delete group successfully!';
		}
	}

};

export default GroupMutation;